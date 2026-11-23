import React from "react";
import Image, { ImageProps } from "next/image";
import { cx } from "../utils/joinClassNames";
import style from "./layout.module.css";
import { imgSizes } from "../utils/imgSizes";

type HtmlProps<T extends keyof React.JSX.IntrinsicElements = "div"> =
  React.ComponentProps<T>;

/**
 * ArticleWrapper
 *
 * The outermost page container for case studies and work pages below the PageHeader.
 *
 * Layout Function:
 * - Sets base theme background (`--background-color-1`) and top/bottom borders (`--border-1`).
 * - Applies centered layout (`.ArticleLayout`) constrained to `max-width: var(--column-full)` (1080px)
 *   with vertical and horizontal padding.
 * - Injects typography and element styling (`.PageElements`, `.MetaHeader`).
 * - Sets `ColumnTextChildren` so direct body text/paragraphs default to `max-width: var(--column-text)` (720px)
 *   without requiring manual wrappers.
 */
const ArticleWrapper: React.FC<HtmlProps> = ({
  className,
  children,
  ...props
}) => (
  <section className={cx(className, style.ArticleWrapper)} {...props}>
    <div
      className={cx(
        style.PageElements,
        style.MetaHeader,
        style.ArticleLayout,
        style.ColumnTextChildren
      )}
    >
      {children}
    </div>
  </section>
);

/**
 * ColumnText
 *
 * Text-width layout container constrained to optimal reading line length.
 *
 * Layout Function:
 * - Constrained to `max-width: var(--column-text)` (720px) with 16px vertical margins.
 * - Declares a CSS container query context (`container-type: inline-size; container-name: LayoutColumn`).
 * - Used for body text blocks, reading-width multi-column persona grids, and narrow descriptions.
 */
const ColumnText: React.FC<HtmlProps> = ({ className, ...props }) => (
  <div
    className={cx(className, style.ColumnText, style.ColumnContainer)}
    {...props}
  />
);

/**
 * ColumnFull
 *
 * Content-width layout container spanning the full width of the article layout.
 *
 * Layout Function:
 * - Expands to the full width of `.ArticleLayout` (`max-width: var(--column-full)` = 1080px).
 * - Declares a CSS container query context (`container-type: inline-size; container-name: LayoutColumn`).
 * - Used for medium-width diagrams, multi-column feature grids, and low-fi wireframe mockups.
 */
const ColumnFull: React.FC<HtmlProps> = ({ className, ...props }) => (
  <div
    className={cx(className, style.ColumnFull, style.ColumnContainer)}
    {...props}
  />
);

/**
 * ColumnMax
 *
 * Maximum-width breakout container that bleeds beyond the standard 1080px article content.
 *
 * Layout Function:
 * - Breaks out of the 1080px container to span up to `max-width: var(--column-max)` (1600px).
 * - Uses `width: 100vw; width: var(--clientWidth, 100vw)` and centers via `left: 50%; transform: translateX(-50%)`
 *   with horizontal padding (`padding: 0 var(--column-padding)`).
 * - Declares a CSS container query context (`container-type: inline-size; container-name: LayoutColumn`).
 * - Used for full portfolio gallery grids (Archive pages) and high-fidelity screen showcases (Featured pages).
 */
const ColumnMax: React.FC<HtmlProps> = ({ className, ...props }) => (
  <div
    className={cx(className, style.ColumnMax, style.ColumnContainer)}
    {...props}
  />
);

/**
 * Helper to inspect child props and extract aspect ratio (width / height).
 * Supports StaticImageData objects (imported from app/media), explicit width/height, or aspectRatio prop.
 */
const getChildAspectRatio = (child: React.ReactNode): number => {
  if (!React.isValidElement(child)) return 1;
  const props = child.props as any;

  if (typeof props?.aspectRatio === "number" && props.aspectRatio > 0) {
    return props.aspectRatio;
  }

  const imgProps = props?.imageProps;
  if (imgProps) {
    if (typeof imgProps.aspectRatio === "number" && imgProps.aspectRatio > 0) {
      return imgProps.aspectRatio;
    }
    if (typeof imgProps.src === "object" && imgProps.src !== null) {
      const { width, height } = imgProps.src;
      if (typeof width === "number" && typeof height === "number" && height > 0) {
        return width / height;
      }
    }
    if (imgProps.width && imgProps.height) {
      const w = Number(imgProps.width);
      const h = Number(imgProps.height);
      if (w > 0 && h > 0) return w / h;
    }
  }

  if (props?.src && typeof props.src === "object" && props.src !== null) {
    const { width, height } = props.src;
    if (typeof width === "number" && typeof height === "number" && height > 0) {
      return width / height;
    }
  }

  if (props?.width && props?.height) {
    const w = Number(props.width);
    const h = Number(props.height);
    if (w > 0 && h > 0) return w / h;
  }

  return 1;
};

/**
 * Columns
 *
 * Responsive multi-column layout grid for arranging images, cards, or content blocks into rows.
 *
 * Layout Function:
 * - Standard Grid (`equalHeight={false}`): Generates equal-width column tracks (`repeat(count, 1fr)`).
 * - Proportional Equal Height Grid (`equalHeight={true}`): Reads each child image's aspect ratio and assigns
 *   proportional `fr` tracks (`gridTemplateColumns: "${ratios.map(r => `${r}fr`).join(' ')}"`).
 *   This ensures all child images render at identical heights and dynamically scaled widths.
 * - Responsive Breakpoints: When `wrap={true}` (default), container queries automatically collapse columns
 *   on smaller container widths (e.g. down to 1 column at <= 600px).
 * - Adjacent Spacing: Sibling rule `&+&` applies `margin-top: 8px` between consecutive Columns elements.
 *   Single images should be wrapped in `<Layouts.Columns count={1}>` for consistent spacing.
 *
 * @param count - Number of columns (1-8, default 1).
 * @param equalHeight - When true, adjusts column widths based on aspect ratios so all children match heights.
 * @param wrap - When true (default), enables responsive container-query column collapsing.
 */
const Columns: React.FC<
  HtmlProps & {
    wrap?: boolean;
    count?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    equalHeight?: boolean;
  }
> = ({
  className,
  wrap = true,
  count = 1,
  equalHeight = false,
  children,
  style: rootStyle,
  ...props
}) => {
  if (equalHeight) {
    const childrenArray = React.Children.toArray(children).filter((child) =>
      React.isValidElement(child)
    );
    const ratios = childrenArray.map(getChildAspectRatio);
    // Normalize so tracks sum to 1fr: fr values summing < 1 only fill that
    // fraction of the row (e.g. two tall portrait images). Proportions unchanged.
    const ratioSum = ratios.reduce((sum, r) => sum + r, 0) || 1;
    const gridTemplateColumns = ratios.map((r) => `${r / ratioSum}fr`).join(" ");

    return (
      <div
        className={cx(
          className,
          style.Columns,
          wrap && style.ColumnsWrap
        )}
        style={{
          gridTemplateColumns,
          ...rootStyle,
        }}
        {...props}
      >
        {childrenArray.map((child, index) => {
          if (!React.isValidElement(child)) return child;
          const ratio = ratios[index];
          const childProps = child.props as any;

          return React.cloneElement(child as React.ReactElement<any>, {
            style: {
              aspectRatio: `${ratio}`,
              width: "100%",
              height: "auto",
              minWidth: 0,
              ...childProps?.style,
            },
          });
        })}
      </div>
    );
  }

  return (
    <div
      className={cx(className, style.Columns, styleColumnCount[count - 1])}
      style={rootStyle}
      {...props}
    >
      {children}
    </div>
  );
};

const styleColumnCount = [
  style.Columns1,
  style.Columns2,
  style.Columns3,
  style.Columns4,
  style.Columns5,
  style.Columns6,
  style.Columns7,
  style.Columns8,
];

/**
 * Safely resolves placeholder mode to prevent Next.js errors when blurDataURL is missing.
 */
const getSafePlaceholder = (
  imageProps: Partial<ImageProps>
): ImageProps["placeholder"] => {
  const hasBlur = Boolean(
    imageProps.blurDataURL ||
      (typeof imageProps.src === "object" &&
        imageProps.src !== null &&
        "blurDataURL" in imageProps.src &&
        Boolean((imageProps.src as { blurDataURL?: string }).blurDataURL))
  );

  if (imageProps.placeholder === "blur" && !hasBlur) {
    return "empty";
  }
  return imageProps.placeholder ?? (hasBlur ? "blur" : "empty");
};

/**
 * FigureCaption
 *
 * Semantic `<figure>` component pairing an image with an italicized side-by-side or stacked caption.
 *
 * Layout Function:
 * - Uses flexbox (`display: flex; gap: 8px 16px; flex-wrap: wrap`) inside a `ColumnFull` container.
 * - The `<Image>` is constrained to reading width (`max-width: var(--column-text)` = 720px).
 * - The `<figcaption>` flexes alongside (`flex: 1 1 0; min-width: 160px`) and wraps beneath on narrow viewports.
 *
 * @param imageProps - Props forwarded to Next.js `<Image>`.
 * @param screenshot - When true (default), applies rounded corners and drop shadow.
 */
const FigureCaption: React.FC<
  HtmlProps & { imageProps: ImageProps; screenshot?: boolean }
> = ({
  className,
  children,
  imageProps: {
    className: imageClassName,
    placeholder: userPlaceholder,
    style: imageStyle,
    ...imageProps
  },
  screenshot = true,
  style: rootStyle,
  ...props
}) => {
  const placeholder = getSafePlaceholder({
    ...imageProps,
    placeholder: userPlaceholder,
  });

  return (
    <figure
      className={cx(
        className,
        style.ColumnFull,
        style.ColumnContainer,
        style.Figure
      )}
      style={rootStyle}
      {...props}
    >
      <Image
        className={cx(imageClassName, screenshot && style.Screenshot)}
        sizes={imgSizes.column1Text}
        style={imageStyle}
        {...imageProps}
        placeholder={placeholder}
      />
      <figcaption>{children}</figcaption>
    </figure>
  );
};

/**
 * Graphic
 *
 * Centered presentation card for isolated icons, UI glyphs, or technical diagram assets.
 *
 * Layout Function:
 * - Displays a grid card with subtle background tint (`--background-color-3`) and border radius.
 * - Centers content horizontally and vertically with internal padding (`padding: 24px`, responsive `8px` on <= 600px).
 * - Commonly used inside multi-column persona or feature lists (e.g. RedEye persona breakdown).
 *
 * @param imageProps - Props forwarded to Next.js `<Image>`.
 */
const Graphic: React.FC<HtmlProps & { imageProps: ImageProps }> = ({
  className,
  imageProps: {
    placeholder: userPlaceholder,
    style: imageStyle,
    ...imageProps
  },
  style: rootStyle,
  ...props
}) => {
  const placeholder = getSafePlaceholder({
    ...imageProps,
    placeholder: userPlaceholder,
  });

  return (
    <div className={cx(className, style.Graphic)} style={rootStyle} {...props}>
      <Image style={imageStyle} {...imageProps} placeholder={placeholder} />
    </div>
  );
};

/**
 * Image (_Image)
 *
 * Optimized Next.js `<Image>` wrapper tailored for case study layout grids.
 *
 * Layout Function:
 * - Automatically provides blur placeholder fallback.
 * - `screenshot={true}` (default): Applies subtle rounded corners (`--border-radius-image`: 4px)
 *   and elevation drop shadow (`--box-shadow-2`).
 * - `screenshot={false}`: Renders flat without drop shadow (useful for transparent graphics).
 * - Accepts responsive sizes from `imgSizes` utility (e.g. `imgSizes.column1Max`, `imgSizes.column2Max`).
 *
 * @param imageProps - Props forwarded to Next.js `<Image>`.
 * @param screenshot - Toggle drop-shadow and rounded frame styling (default true).
 */
const _Image: React.FC<
  Omit<HtmlProps<"img">, "ref" | "src" | "alt" | "width" | "height" | "loading" | "placeholder" | "srcSet"> & { imageProps: ImageProps; screenshot?: boolean }
> = ({
  className,
  imageProps: {
    className: imageClassName,
    placeholder: userPlaceholder,
    style: imageStyle,
    ...imageProps
  },
  screenshot = true,
  style: rootStyle,
  ...props
}) => {
  const placeholder = getSafePlaceholder({
    ...imageProps,
    placeholder: userPlaceholder,
  });

  return (
    <Image
      className={cx(
        className,
        imageClassName,
        screenshot ? style.Screenshot : style.Flat
      )}
      style={{
        ...rootStyle,
        ...imageStyle,
      }}
      {...imageProps}
      {...props}
      placeholder={placeholder}
    />
  );
};

/**
 * Note
 *
 * Aside callout box for supplementary notes, methodology commentary, or key takeaways.
 *
 * Layout Function:
 * - Renders a semantic `<aside>` element with background tint (`--background-color-3`), border,
 *   rounded corners, and generous padding (`margin: 32px 0; padding: 24px`).
 * - Direct first-child top margin is reset to `0` for clean alignment.
 */
const Note: React.FC<HtmlProps> = ({ className, ...props }) => (
  <aside className={cx(className, style.Note)} {...props} />
);

export const Layouts = {
  ArticleWrapper,
  ColumnText,
  ColumnFull,
  ColumnMax,
  Columns,
  FigureCaption,
  Graphic,
  Image: _Image,
  Note,
};

