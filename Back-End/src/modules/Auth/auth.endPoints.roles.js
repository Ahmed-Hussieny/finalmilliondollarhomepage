import { systemRoles } from "../../utils/system-roles";

export const authEndPointsRoles = {
    SIGN_UP: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    VERIFY_EMAIL: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
    SIGN_IN: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
};