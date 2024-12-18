import "photoswipe/dist/photoswipe.css";
import { FC, useState } from "react";

import { Gallery, Item } from "react-photoswipe-gallery";

export const Photo: FC<{
  sources: string[];
}> = ({ sources }) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  return (
    <Gallery>
      <Item
        original={sources[0]}
        thumbnail={sources[0]}
        height={height * 3}
        width={width * 3}
      >
        {({ ref, open }) => (
          <img
            onLoad={(v) => {
              setHeight(v.currentTarget.height);
              setWidth(v.currentTarget.width);
            }}
            onClick={open}
            ref={ref}
            src={sources[0]}
            alt=""
            className="rounded-sm"
          />
        )}
      </Item>
    </Gallery>
  );
};
