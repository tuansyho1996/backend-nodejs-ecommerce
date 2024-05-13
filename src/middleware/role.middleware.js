'use strict'
import { AccessControl } from "accesscontrol";
import rbacService from "../services/rbac.service.js"
const grantList = await rbacService.roleList()
console.log(grantList)

export default new AccessControl(grantList);