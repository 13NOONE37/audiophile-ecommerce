// import React from 'react';
// import Header from '../header/header';
// import styles from './homeHero.module.css';
// import { getImageProps } from 'next/image';

// import ImageDesktop from '../../../public/images/home/desktop/image-hero.jpg';
// import ImageTablet from '../../../public/images/home/tablet/image-hero.jpg';
// import ImageMobile from '../../../public/images/home/mobile/image-hero.jpg';
// import LinkButton from '../buttons/linkButton';
// const HomeHero = () => {
//   const altText = `XX99 Mark II
//     Headphones`;
//   const {
//     props: { srcSet: desktop },
//   } = getImageProps({
//     src: ImageDesktop,
//     alt: altText,
//   });
//   const {
//     props: { srcSet: tablet },
//   } = getImageProps({
//     src: ImageTablet,
//     alt: altText,
//   });
//   const {
//     props: { srcSet: mobile },
//   } = getImageProps({
//     src: ImageMobile,
//     alt: altText,
//   });

//   return (
//     <section className={styles.hero}>
//       <Header className={[styles.heading]} />
//       <picture>
//         <source media="(min-width:1190px)" srcSet={desktop} />
//         <source media="(min-width:550px)" srcSet={tablet} />
//         <img srcSet={mobile} className={styles.image} alt={altText} />
//       </picture>
//       <div className={styles['hero-content']}>
//         <div className={styles.content}>
//           <span>New product</span>
//           <h2>XX99 Mark II Headphones</h2>
//           <p>
//             Experience natural, lifelike audio and exceptional build quality
//             made for the passionate music enthusiast.
//           </p>
//           <LinkButton
//             style={'primary'}
//             href={'/product/xx99-mark-II-headphones'}
//             additionalClassnames={[styles.cta]}
//           >
//             See product
//           </LinkButton>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HomeHero;
