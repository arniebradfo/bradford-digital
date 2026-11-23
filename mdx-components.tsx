import fs from "fs";
import path from "path";
import { imageSize } from "image-size";
import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { B, H1, H2, H3, H4, H5, H6, I, Txt } from "./app/components/Text";

/** https://nextjs.org/docs/app/building-your-application/configuring/mdx#custom-elements */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    strong: B,
    em: I,
    img: Img,
    video: Video,
    ...components,
  };
}

/** Bare MDX `<video src>` tags get playback controls and a first-frame preview
 * (matches the old Gatsby `MdxVideo` component). */
const Video = (props: React.ComponentProps<"video">) => (
  <video preload="metadata" controls playsInline {...props} />
);

/** https://shaneafsar.com/blog/markdown-mdx-next-images/ */
const Img = ({
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  // Copy props into new object since it's locked
  const newProps = { ...props };

  let newSrc = typeof props.src === "string" ? props.src : ""; // TODO: error image?

  const isLocalImage = !newSrc.startsWith("http");

  // If no dimensions are defined, let's find it!
  if (!props.width && !props.height && isLocalImage) {
    // Extract the file name and path. You may need to adjust this for your app.
    const fileName = newSrc.replace("/images", ""); // e.g. file.png, or /subdir/file.png
    const filePath = path.join(process.cwd(), fileName);

    const dimensions = imageSize(fs.readFileSync(filePath));

    newProps.width = dimensions.width;
    newProps.height = dimensions.height;
  }

  /**
   * If you have a different basePath for your application (e.g. site.xyz/docs/),
   * you might want to hardcode that here so that you don't need to write it for
   * every image.
   */
  if (/* !newSrc.startsWith(basePath) &&  */ isLocalImage) {
    newProps.src = `${basePath}${newSrc?.replace("public/", "/")}`;
  }
  return <Image {...(newProps as ImageProps)} />;
};

const basePath = "";
