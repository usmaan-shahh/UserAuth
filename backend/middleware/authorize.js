import ac from "../configuration/roles.js";


export const authorize = (action, resource) => {

    return (req, res, next) => {

      const { roles, userId } = req.auth;
  
   
      let hasPermission = false;
  

      //Role permission check
      for (const role of roles) {
        const permission = ac.can(role)[action](resource); //Example Can (customer).readOwn("profile") 
        if (permission.granted) {
          hasPermission = true;
          break;
        }
      }
  
      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // For "Own" actions, verify user is accessing their own data
      if (action.endsWith("Own")) {  

        const resourceId = req.params.userId;
        
        if (resourceId && resourceId !== userId) {

          return res.status(403).json({ message: "Forbidden" });
          
        }
      }
  
      next();
    };
  };

  export default authorize;