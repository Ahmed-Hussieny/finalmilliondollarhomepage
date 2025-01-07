import { systemRoles } from "../../utils/system-roles.js";

export const logoEndPointsRoles = {
    ADD_LOGO: [systemRoles.ADMIN],
    UPDATE_LOGO: [systemRoles.ADMIN],
    DELETE_LOGO: [systemRoles.ADMIN],
};