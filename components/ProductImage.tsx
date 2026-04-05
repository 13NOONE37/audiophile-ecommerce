import { ProductWithDetails } from '@/app/(public)/(default)/product/[slug]/page';
import { imageRoleEnum, imageTypeEnum } from '@/db/schema';
import Image, { ImageProps } from 'next/image';

export type ImageRole = (typeof imageRoleEnum.enumValues)[number];
export type ImageType = (typeof imageTypeEnum.enumValues)[number];
export type ProductWithImages = {
  name: string;
  images: ProductWithDetails['images'];
};

type BaseProductImageProps = {
  image: ProductWithDetails['images'][number];
  fallbackAlt: string;
} & Omit<ImageProps, 'src' | 'alt'>;

export type ProductImageProps = {
  product: ProductWithImages;
  role: ImageRole;
  type?: ImageType;
  position?: number;
} & Omit<ImageProps, 'src' | 'alt'>;

export function ProductResolvedImage({
  image,
  fallbackAlt,
  ...props
}: BaseProductImageProps) {
  const {
    width: propWidth,
    height: propHeight,
    fill,
    ...restProps
  } = props as {
    width?: number;
    height?: number;
    fill?: boolean;
  } & Record<string, unknown>;

  const hasExplicitWidth = propWidth !== undefined && propWidth !== null;
  const hasExplicitHeight = propHeight !== undefined && propHeight !== null;

  const resolvedWidth = hasExplicitWidth
    ? propWidth
    : fill
      ? undefined
      : (image.width ?? undefined);

  const resolvedHeight = hasExplicitHeight
    ? propHeight
    : fill
      ? undefined
      : (image.height ?? undefined);

  const sizeProps = fill
    ? { fill: true as const }
    : { width: resolvedWidth, height: resolvedHeight };

  return (
    <Image
      src={image.path}
      alt={image.altText ?? fallbackAlt}
      placeholder={image.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={image.blurDataURL ?? undefined}
      {...sizeProps}
      {...(restProps as Omit<ImageProps, 'src' | 'alt'>)}
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
