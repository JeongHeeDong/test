package com.ltem.enums;

/**
 * Created by sungnam on 2016-01-02.
 */
public enum UserPwdCheck {
    OK(0),
    EMPTY(1),
    NOT_OK(2);

    private int pwdCheck;

    private UserPwdCheck() {

    }

    private UserPwdCheck(int pwdCheck) {
        this.pwdCheck = pwdCheck;
    }

    public int getPwdCheck() {
        return pwdCheck;
    }
}
