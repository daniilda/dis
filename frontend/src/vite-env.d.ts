/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "*.svg?react" {
  const content: React.FC<HTMLProps<SVGElement>>;
  export default content;
}
