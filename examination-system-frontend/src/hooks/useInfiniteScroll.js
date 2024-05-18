import { useState, useEffect } from "react";

const useInfiniteScroll = (callback, isFinished) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isFinished) {
      return;
    }
    if (isFetching) {
      callback();
    }
    function handleScroll() {
      const footer = document.getElementById("footer");
      const footerHeight = footer ? footer.offsetHeight : 0;

      const clientScroll =
        window.innerHeight + document.documentElement.scrollTop;
      const pageHeightWithoutFooter =
        document.documentElement.offsetHeight - footerHeight;
      if (pageHeightWithoutFooter - clientScroll <= 100 && !isFetching) {
        setIsFetching(true);
      }

      // JUST FOR TEST. ignore this code. START
      if (window.scrollTop === -500 && !isFetching) {
        setIsFetching(true);
      }
      // END
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, isFinished]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
