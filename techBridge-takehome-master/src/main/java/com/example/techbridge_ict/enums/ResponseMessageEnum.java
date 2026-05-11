package com.example.techbridge_ict.enums;

public enum ResponseMessageEnum {
    BACK_SYSTEM_ERROR_MSG_001("back.system.error.msg.001", "A system error occurred, please try again later."),
    BACK_JSON_CONVERTOR_MSG_001("back.user_convertor.msg.001", "Error occurred while converting JSON."),

    BACK_ROLE_MSG_001("back.role.msg.001", "Role definition not found."),
    BACK_ROLE_MSG_002("back.role.msg.002", "Role with this name already exists, please enter a different name."),
    BACK_ROLE_MSG_003("back.role.msg.003", "You can delete the role after removing assigned users."),
    BACK_ROLE_MSG_004("back.role.msg.004", "Role deleted successfully."),

    BACK_PRIVILEGE_MSG_001("back.privilege.msg.001", "Privilege definition not found."),
    BACK_PRIVILEGE_MSG_002("back.privilege.msg.002", "You can delete the privilege after removing assigned roles."),
    BACK_PRIVILEGE_MSG_003("back.privilege.msg.003", "Privilege with this name already exists, please enter a different name."),
    BACK_PRIVILEGE_MSG_004("back.privilege.msg.004", "Privilege removed successfully"),

    BACK_TOKEN_MSG_001("back.token.001","Invalid refresh token"),

    BACK_USER_MSG_001("back.user.msg.001", "User not found."),
    BACK_USER_MSG_002("back.user.msg.002", "This phone number is already registered."),
    BACK_USER_MSG_003("back.user.msg.003", "This email is already registered."),
    BACK_USER_MSG_004("back.user.msg.004", "This user is not active."),
    BACK_USER_MSG_007("back.user.msg.007", "Incorrect email or password."),
    BACK_USER_MSG_006("back.user.msg.006", "Phone number or email is already in use."),
    BACK_USER_MSG_008("back.user.msg.008", "User first name is must be provided"),
    BACK_USER_MSG_009("back.user.msg.009", "User last name is must be provided"),
    BACK_USER_MSG_010("back.user.msg.010", "User email is must be provided"),
    BACK_USER_MSG_011("back.user.msg.011", "Operation cant only be done by current user"),
    BACK_USER_MSG_012("back.user.msg.012", "User is pending for approval"),
    BACK_USER_MSG_013("back.user.msg.013", "User creation process has been successfully completed."),
    BACK_USER_MSG_014("back.user.msg.014", "User creation process has been successfully completed"),
    BACK_USER_MSG_015("back.user.msg.015", "User password is been changed successfully"),
    BACK_USER_MSG_016("back.user.msg.016", "User activation has been successfully completed"),
    BACK_USER_MSG_017("back.user.msg.017", "User de-activation has been successfully"),
    BACK_USER_MSG_018("back.user.msg.018", "User approval has been successfully completed"),
    BACK_USER_MSG_019("back.user.msg.019", "User unapproved successfully"),
    BACK_USER_MSG_020("back.user.msg.020", "User is already approved"),
    BACK_USER_MSG_021("back.user.msg.021", "User is already unapproved "),
    BACK_USER_MSG_022("back.user.msg.022", "User device token is facing a problem contact administration"),
    BACK_USER_MSG_023("back.user.msg.023", "User deleted successfully"),
    BACK_USER_MSG_024("back.user.msg.024", "User full name required"),
    BACK_USER_MSG_025("back.user.msg.025", "User phone number required"),
    BACK_USER_MSG_026("back.user.msg.026", "User  profession cannot be empyt"),



    BACK_EMAIL_MSG_004("back.email.msg.004", "You have sent an invalid email."),

    BACK_SECURITY_MSG_001("back.security.msg.001", "You cannot perform operations with a user that does not belong to you"),
    BACK_SECURITY_MSG_002("back.security.msg.002", "Password encryption error occurred"),

    BACK_TEMPLATE_MSG_001("back.template.msg.001", "An error occurred while creating the template"),

    BACK_USER_MSG_027("back.user.msg.027", "A validation error occurred"),


    BACK_FILE_MSG_001("back.file.msg.001", "An error occurred while saving the file."),
    BACK_FILE_MSG_002("back.file.msg.002", "An error occurred while deleting the file."),
    BACK_FILE_MSG_003("back.file.msg.003", "The file size cannot exceed 10MB."),


    BACK_STAFF_MSG_01("back.staff.msg.01", "Staff first name is required"),
    BACK_STAFF_MSG_02("back.staff.msg.02", "Staff last name is required"),
    BACK_STAFF_MSG_03("back.staff.msg.03", "Staff email is required"),
    BACK_STAFF_MSG_04("back.staff.msg.04", "Staff record cannot be found"),
    BACK_STAFF_MSG_05("back.staff.msg.05", "Staff created successfully"),
    BACK_STAFF_MSG_06("back.staff.msg.06", "Staff deleted successfully"),
    BACK_STAFF_MSG_07("back.staff.msg.07", "Staff details updated successfully"),
    BACK_STAFF_MSG_08("back.staff.msg.08", "Staff email already exists"),
    BACK_STAFF_MSG_09("back.staff.msg.09", "Staff employee ID is required"),



    BACK_ASSET_MSG_01("back.asset.msg.01", "Asset serial number is required"),
    BACK_ASSET_MSG_02("back.asset.msg.02", "Asset model is required"),
    BACK_ASSET_MSG_03("back.asset.msg.03", "Asset type is required"),
    BACK_ASSET_MSG_04("back.asset.msg.04", "Asset cannot be found"),
    BACK_ASSET_MSG_05("back.asset.msg.05", "Asset registered successfully"),
    BACK_ASSET_MSG_06("back.asset.msg.06", "Asset deleted successfully"),
    BACK_ASSET_MSG_07("back.asset.msg.07", "Asset updated successfully"),
    BACK_ASSET_MSG_08("back.asset.msg.08", "Asset assigned to staff successfully"),
    BACK_ASSET_MSG_09("back.asset.msg.09", "Asset unassigned successfully"),
    BACK_ASSET_MSG_10("back.asset.msg.10", "Asset serial number already exists"),
    ;
    private final String message;
    private final String messageDetail;

    ResponseMessageEnum(String message, String messageDetail) {
        this.message = message;
        this.messageDetail = messageDetail;
    }

    public String message() {
        return this.message;
    }

    public String messageDetail() {
        return this.messageDetail;
    }
}

