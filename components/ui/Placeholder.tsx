import type { SiteString } from "@/content/site";
import { isExample, unwrap } from "@/content/site";
import { showPlaceholders } from "@/lib/placeholders";

type Props = {
  value: SiteString;
  className?: string;
  as?: "span" | "strong" | "em";
};

export function Placeholder({ value, className = "", as: Tag = "span" }: Props) {
  const text = unwrap(value);
  const highlight = isExample(value) && showPlaceholders();

  if (!highlight) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      className={`placeholder-mark ${className}`}
      title="UKÁZKOVÁ DATA – nahradit před spuštěním"
      data-example="true"
    >
      {text}
    </Tag>
  );
}
