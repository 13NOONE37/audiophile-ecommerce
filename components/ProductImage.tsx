import { imageRoleEnum, imageTypeEnum } from '@/db/schema';
import Image, { ImageProps } from 'next/image';

export type ImageRole = (typeof imageRoleEnum.enumValues)[number];
export type ImageType = (typeof imageTypeEnum.enumValues)[number];

export type ProductImageRecord = {
  path: string;
  altText: string | null;
  role: ImageRole;
  type: ImageType;
  position: number | null;
  blurDataURL: string | null;
  width: number | null;
  height: number | null;
};
export type ProductWithImages = {
  name: string;
  images: ProductImageRecord[];
};

type BaseProductImageProps = {
  image: ProductImageRecord;
  fallbackAlt: string;
} & Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>;

export type ProductImageProps = {
  product: ProductWithImages;
  role: ImageRole;
  type?: ImageType;
  position?: number;
} & Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>;

export function ProductResolvedImage({
  image,
  fallbackAlt,
  ...props
}: BaseProductImageProps) {
  if (image.width == null || image.height == null) return null;

  return (
    <Image
      src={image.path}
      alt={image.altText ?? fallbackAlt}
      width={props.fill ? undefined : image.width}
      height={props.fill ? undefined : image.height}
      placeholder={image.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={image.blurDataURL ?? undefined}
      {...props}
    />
  );
}

function selectProductImage(
  product: ProductWithImages,
  role: ImageRole,
  type: ImageType,
  position: number,
) {
  const roleMatches = product.images.filter((image) => image.role === role);

  return (
    roleMatches.find(
      (image) => image.type === type && (image.position ?? 0) === position,
    ) ??
    roleMatches.find((image) => image.type === type) ??
    roleMatches.find((image) => image.type === 'desktop') ??
    roleMatches[0]
  );
}

export function ProductImage({
  product,
  role,
  type = 'desktop',
  position = 0,
  ...props
}: ProductImageProps) {
  const image = selectProductImage(product, role, type, position);
  if (!image) return null;

  return (
    <ProductResolvedImage image={image} fallbackAlt={product.name} {...props} />
  );
}
