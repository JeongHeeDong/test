package com.ltem.enums;

/**
 * Created by sungnam on 2016-01-01.
 */
public enum UserIDCheck {
    OK(0),
    DUPLICATION(1),
    EMPTY(2),
    INVALID_STRING(3),
    INVALID_FIRST_STRING(4);

    private int idCheck;

    private UserIDCheck() {

    }

    private UserIDCheck(int idCheck) {
        this.idCheck = idCheck;
    }

    public int getIdCheck() {
        return idCheck;
    }
}
