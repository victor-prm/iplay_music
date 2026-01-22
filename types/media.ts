export interface MediaImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface MediaCardProps {
  images?: MediaImage[];
  title: string;
  meta?: React.ReactNode;
  href?: string;
  className?: string;
  index?: number;
}