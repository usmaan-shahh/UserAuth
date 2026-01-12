import AccessControl from "accesscontrol";

const ac = new AccessControl();

ac.grant("customer")
  .readOwn("profile");

ac.grant("admin")
  .extend("customer")
  .createAny("profile")   
  .readAny("profile")
  .updateAny("profile")
  .deleteAny("profile")
  .createAny("admin");   

export default ac;
