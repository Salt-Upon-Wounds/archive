import { rest } from "msw";
import apiRoutes from "../../constants/api-routes.constant";
import { UserId1, UserId2, UserId3, UserId4 } from "../mocks/users.mock";

const usersHandler = [
  rest.get(apiRoutes.users.getCurrentUser(), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    return res(ctx.status(401));
  }),
  rest.get(apiRoutes.users.showUser(":userId"), (req, res, ctx) => {
    const { userId } = req.params;
    switch (Number(userId)) {
      case 1:
        return res(ctx.json(UserId1));
      case 2:
        return res(ctx.json(UserId2));
      case 3:
        return res(ctx.json(UserId3));
      case 4:
        return res(ctx.json(UserId4));
      default:
        throw new Error("unexpected user id in users.handler");
    }
  }),
];

export default usersHandler;
