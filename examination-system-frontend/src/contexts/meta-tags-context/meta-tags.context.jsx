import { createContext, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";

export const MetaTagsContext = createContext();

export const MetaTagsProvider = ({ children }) => {
  const [metaData, setMetaData] = useState({});

  const value = {
    changeMetaData: useCallback((newMetaData) => setMetaData(newMetaData), []),
    metaData,
  };

  return (
    <MetaTagsContext.Provider value={value}>
      <Helmet>
        <title>
          {metaData.title ? `${metaData.title} - ` : "FizMat"}FizMat
        </title>
        <meta
          name="description"
          content={
            metaData.description ||
            "FizMat подготовти тебя к ЦТ без репетитора и в любое время суток"
          }
        />
        <meta
          property="og:title"
          content={`${
            metaData.ogTitle
              ? `${metaData.ogTitle} - `
              : "FizMat подготовти тебя к ЦТ без репетитора и в любое время суток"
          }FizMat`}
        />
        <meta
          property="og:description"
          content={
            metaData.ogDescription ||
           "FizMat подготовти тебя к ЦТ без репетитора и в любое время суток"
          }
        />
        <meta
          property="og:image"
          content={
            metaData.ogImage || "./auth-image.jpg"//ссылку на картинку полным адресом
          }
        />
      </Helmet>
      {children}
    </MetaTagsContext.Provider>
  );
};
