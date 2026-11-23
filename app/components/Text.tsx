import React, { HTMLAttributes } from "react";
import style from "./Text.module.css";
import { cx } from "../utils/joinClassNames";

export type TxtProps = HTMLAttributes<HTMLOrSVGElement> & {
  /** type of tag to use - <span/> is default */
  tag?: keyof React.JSX.IntrinsicElements;

  /** color, foreground: 1 is darkest, 4 is lightest, 2 is default */
  fg?: 1 | 2 | 3 | 4;

  /** text-size: 1 is largest, 6 is smallest, 5 is default */
  size?: 1 | 2 | 3 | 4 | 5 | 6;

  /** font-weight: bold;  */
  bold?: boolean;
  /** font-weight: normal; default (ie not bold)  */
  normal?: boolean;
  /** font-style: italic;  */
  italic?: boolean;

  /** font-family: sans-serif; default */
  sans?: boolean;
  /** font-family: monospace; (ie code) */
  mono?: boolean;

  /** text-transform: uppercase; letter-spacing: ++; */
  uppercase?: boolean;
  /** text-overflow: ellipsis; truncate text with '...' if its in a flex parent */
  ellipsis?: boolean;
};

/** A utility text component for declarative styling */
export const Txt: React.FC<TxtProps> = ({
  tag: RootTag = "span",
  fg: color,
  size,
  bold,
  normal,
  italic,
  sans,
  mono,
  uppercase,
  ellipsis,
  className,
  ...props
}) => {
  const classNames = [
    // style.Text, // not needed
    color && colors[color - 1],
    size && sizes[size - 1],
    bold && style.TextBold,
    normal && style.TextNormal,
    italic && style.TextItalic,
    sans && style.TextSans,
    mono && style.TextMono,
    uppercase && style.TextUppercase,
    ellipsis && style.TextEllipsis,
    className,
  ];
  return <RootTag className={cx(...classNames)} {...props} />;
};

const colors = [
  style.TextColor1,
  style.TextColor2,
  style.TextColor3,
  style.TextColor4,
];

const sizes = [
  style.TextSize1,
  style.TextSize2,
  style.TextSize3,
  style.TextSize4,
  style.TextSize5,
  style.TextSize6,
];

export const H1 = (p: TxtProps) => <Txt tag="h1" size={1} fg={1} bold {...p} />;
export const H2 = (p: TxtProps) => <Txt tag="h2" size={2} fg={1} bold {...p} />;
export const H3 = (p: TxtProps) => <Txt tag="h3" size={3} fg={1} bold {...p} />;
export const H4 = (p: TxtProps) => <Txt tag="h4" size={4} fg={1} bold {...p} />;
export const H5 = (p: TxtProps) => <Txt tag="h5" size={5} fg={1} bold {...p} />;
export const H6 = (p: TxtProps) => <Txt tag="h6" size={6} fg={1} bold {...p} />;
export const P = (p: TxtProps) => <Txt tag="p" {...p} />;
export const B = (p: TxtProps) => <Txt tag="strong" bold fg={1} {...p} />;
export const I = (p: TxtProps) => <Txt tag="em" bold fg={1} {...p} />;
export const Meta = (p: TxtProps) => <Txt size={6} fg={3} uppercase {...p} />;
