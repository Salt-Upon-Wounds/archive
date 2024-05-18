import { getParams, createPath } from "../url.utility";

describe("check getParams function", () => {
  describe("check when url is not complete", () => {
    test("check when there is not any parameter", () => {
      const output = getParams({ url: "/test/test" });
      expect(output).toEqual({});
    });
    test("check when there is one parameter", () => {
      const output = getParams({ url: "/test/test?gljis=ajlie3" });
      expect(output).toEqual({ gljis: "ajlie3" });
    });
    test("check when there is more than one parameter", () => {
      const output = getParams({ url: "/test/test?gljis=ajlie3&fjilw=qnpi" });
      expect(output).toEqual({ gljis: "ajlie3", fjilw: "qnpi" });
    });
    test("check when the parameters are not valid", () => {
      const output = getParams({
        url: "/test/test?gl%20jis=ajl%3Fie3&fjilw=qn%20pi",
      });
      expect(output).toEqual({ "gl jis": "ajl?ie3", fjilw: "qn pi" });
    });
    describe("check except input", () => {
      test("check when parameters are valid", () => {
        const output = getParams({
          url: "/test/test?gljis=ajlie3&aaa=bbb&fjilw=qnpi&ccc=ddd",
          except: ["aaa", "ccc"],
        });
        expect(output).toEqual({ gljis: "ajlie3", fjilw: "qnpi" });
      });
      test("check when parameters are not valid", () => {
        const output = getParams({
          url: "/test/test?gljis=ajlie3&aa%3fa=bbb&fjilw=qnpi&cc%20c=ddd",
          except: ["aa?a", "cc c"],
        });
        expect(output).toEqual({ gljis: "ajlie3", fjilw: "qnpi" });
      });
    });
  });
  describe("check when url is complete", () => {
    test("check when there is not any parameter", () => {
      const output = getParams({ url: "http://www.test.com/test/test" });
      expect(output).toEqual({});
    });
    test("check when there is one parameter", () => {
      const output = getParams({
        url: "http://www.test.com/test/test?gljis=ajlie3",
      });
      expect(output).toEqual({ gljis: "ajlie3" });
    });
    test("check when there is more than one parameter", () => {
      const output = getParams({
        url: "http://www.test.com/test/test?gljis=ajlie3&fjilw=qnpi",
      });
      expect(output).toEqual({ gljis: "ajlie3", fjilw: "qnpi" });
    });
    test("check when the parameters are not valid", () => {
      const output = getParams({
        url: "http://www.test.com/test/test?gl%20jis=ajl%3Fie3&fjilw=qn%20pi",
      });
      expect(output).toEqual({ "gl jis": "ajl?ie3", fjilw: "qn pi" });
    });
    describe("check except input", () => {
      test("check when parameters are valid", () => {
        const output = getParams({
          url:
            "http://www.test.com/test/test?gljis=ajlie3&aaa=bbb&fjilw=qnpi&ccc=ddd",
          except: ["aaa", "ccc"],
        });
        expect(output).toEqual({ gljis: "ajlie3", fjilw: "qnpi" });
      });
      test("check when parameters are not valid", () => {
        const output = getParams({
          url:
            "http://www.test.com/test/test?gljis=ajlie3&a%3faa=bbb&fjilw=qnpi&cc%20c=ddd",
          except: ["a?aa", "cc c"],
        });
        expect(output).toEqual({ gljis: "ajlie3", fjilw: "qnpi" });
      });
    });
  });
});

describe("check createPath function", () => {
  describe("check when url is not complete", () => {
    test("check when there is not any param", () => {
      const output = createPath({ pathName: "test/test", params: {} });
      expect(output).toBe("test/test");
    });
    test("check when there is one param", () => {
      const output = createPath({
        pathName: "test/test",
        params: { galij: "nsle" },
      });
      expect(output).toBe("test/test?galij=nsle");
    });
    test("check when there is more than one param", () => {
      const output = createPath({
        pathName: "test/test",
        params: { galij: "nsle", aljei: "e3ois" },
      });
      expect(output).toBe("test/test?galij=nsle&aljei=e3ois");
    });
    test("check when the parameters are not valid", () => {
      const output = createPath({
        pathName: "test/test",
        params: { galij: "nsle?nse", aljei: "e3o is" },
      });
      expect(output).toBe("test/test?galij=nsle%3Fnse&aljei=e3o%20is");
    });
  });
  describe("check when url is complete", () => {
    test("check when there is not any param", () => {
      const output = createPath({
        pathName: "http://www.test.com/test/test",
        params: {},
      });
      expect(output).toBe("http://www.test.com/test/test");
    });
    test("check when there is one param", () => {
      const output = createPath({
        pathName: "http://www.test.com/test/test",
        params: { galij: "nsle" },
      });
      expect(output).toBe("http://www.test.com/test/test?galij=nsle");
    });
    test("check when there is more than one param", () => {
      const output = createPath({
        pathName: "http://www.test.com/test/test",
        params: { galij: "nsle", aljei: "e3ois" },
      });
      expect(output).toBe(
        "http://www.test.com/test/test?galij=nsle&aljei=e3ois"
      );
    });
    test("check when the parameters are not valid", () => {
      const output = createPath({
        pathName: "http://www.test.com/test/test",
        params: { galij: "nsle?nse", aljei: "e3o is" },
      });
      expect(output).toBe(
        "http://www.test.com/test/test?galij=nsle%3Fnse&aljei=e3o%20is"
      );
    });
  });
});
