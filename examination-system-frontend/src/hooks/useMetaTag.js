import { useContext, useEffect } from "react";
import { MetaTagsContext } from "../contexts/meta-tags-context/meta-tags.context";

const useMetaTags = (newMetaTags) => {
  const { changeMetaData, metaData } = useContext(MetaTagsContext);

  useEffect(() => {
    if (JSON.stringify(metaData) !== JSON.stringify(newMetaTags)) {
      changeMetaData(newMetaTags);
    }
  }, [metaData, newMetaTags, changeMetaData]);
};

export default useMetaTags;
