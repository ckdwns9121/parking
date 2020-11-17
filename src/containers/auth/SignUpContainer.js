import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind'
/* Library */

import useInput from '../../hooks/useInput';
import InputBox from '../../components/inputbox/InputBox';
import {
    isEmailForm,
    isPasswordForm,
    isCellPhoneForm,
} from '../../lib/formatChecker';

import CheckBox from '../../components/checkbox/CheckBox';

import VerifyPhone from '../../components/verifyphone/VerifyPhone'

import FixedButton from '../../components/button/FixedButton';

import { useDialog } from '../../hooks/useDialog';

import styles from './SignUpContainer.module.scss';
import ArrowSmall from '../../static/asset/svg/ArrowSmall';

const DATE = new Date(1970, 1, 1);
const CURRENT = new Date();

const YEAR = [];
const MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DAY = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
];

for (let i = DATE.getFullYear(); i <= CURRENT.getFullYear(); i++) YEAR.push(i);

const cx = classNames.bind(styles)

const SignUpContainer = () => {
    const openDialog = useDialog();

    const [email, onChangeEmail, isEmail] = useInput('', isEmailForm);
    const [name, onChangeName] = useInput('');
    const [password, onChangePassword, isPassword] = useInput(
        '',
        isPasswordForm,
    );
    const [passwordCheck, onChangePasswordCheck] = useInput('');
    const [phone, onChangePhone, isPhone] = useInput('', isCellPhoneForm);

    const [checkList, setCheckList] = useState([
        {
            id: 1,
            checked: false,
            description: '이용약관 필수 동의',
        },
        {
            id: 2,
            checked: false,
            description: '개인정보 처리방침 필수 동의',
        },
        {
            id: 3,
            checked: false,
            description: '쿠폰 / 이벤트 알림 선택 동의',
            subDescription:
                'SMS, 이메일을 통해 파격할인/이벤트/쿠폰 정보를 받아보실 수 있습니다.',
        },
    ]);

    const [signUp, setSignUp] = useState(true);

    const onClickSignUp = () => {
        console.log('sign up');

        if (signUp) {
            if (isEmail) {
                if (isPassword) {
                    if (isPhone) {
                        try {
                            //api에 따라 처리
                        } catch (e) {
                            openDialog(
                                '서버에 오류가 발생하였습니다',
                                '잠시 후 다시 시도해 주세요.',
                            );
                        }
                    } else {
                        openDialog('휴대폰 번호 형식에 맞지 않습니다!', '');
                    }
                } else {
                    openDialog(
                        '비밀번호 형식에 맞지 않습니다!',
                        '8자 이상으로 문자, 숫자 및 특수문자가 모두 포함되어야 합니다.',
                    );
                }
            } else {
                openDialog('이메일 형식에 맞지 않습니다!', '');
            }
        } else {
            openDialog(
                '정보를 모두 입력해야 합니다.',
                '이메일과 비밀번호를 확인해 주세요.',
            );
        }
    };

    useEffect(() => {
        if (
            email !== '' &&
            name !== '' &&
            password !== '' &&
            phone !== '' &&
            isEmail &&
            isPassword &&
            isPhone &&
            checkList[0].checked &&
            checkList[1].checked
        ) 
            setSignUp(false);

        else setSignUp(true)

        // console.log(email, name, password, isEmail, isPassword, isPhone, checkList[0].checked, checkList[1].checked)
    }, [email, name, password, phone, isEmail, isPassword, isPhone, checkList]);

    return (
        <>
            <div className={cx('container')}>
                <div className={cx('input-wrapper')}>
                    <div className={cx('input-title')}>이메일</div>
                    <InputBox
                        className={'input-bar'}
                        type={'text'}
                        value={email}
                        placeholder={'이메일을 입력해주세요.'}
                        onChange={onChangeEmail}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onClickSignUp();
                        }}
                    />
                </div>

                <div className={cx('input-wrapper')}>
                    <div className={cx('input-title')}>이름</div>
                    <InputBox
                        className={'input-bar'}
                        type={'text'}
                        value={name}
                        placeholder={'이름을 입력해주세요.'}
                        onChange={onChangeName}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onClickSignUp();
                        }}
                    />
                </div>

                <div className={cx('input-wrapper')}>
                    <div className={cx('input-title')}>비밀번호</div>
                    <InputBox
                        className={'input-bar'}
                        type={'password'}
                        value={password}
                        placeholder={'비밀번호를 입력해주세요.'}
                        onChange={onChangePassword}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onClickSignUp();
                        }}
                    />
                    <InputBox
                        className={'input-bar'}
                        type={'password'}
                        value={passwordCheck}
                        placeholder={'비밀번호를 재입력해주세요.'}
                        onChange={onChangePasswordCheck}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onClickSignUp();
                        }}
                    />
                    <div className={cx('password-check', {'apear': password !== '' || passwordCheck !== ''}, {'same': password !== '' && password === passwordCheck })}>비밀번호가 <span>불</span>일치합니다.</div>
                </div>

                <div className={cx('input-wrapper')}>
                    <div className={cx('input-title')}>생년월일</div>

                    <div className={cx('select-wrapper')}>
                        <div className={cx('select-item')}>
                            <select className={cx('select')}>
                                {YEAR.map((y) => (
                                    <option key={y}>{y}년</option>
                                ))}
                            </select>
                            <ArrowSmall rotate={180} />
                        </div>

                        <div className={cx('select-item')}>
                            <select className={cx('select')}>
                                {MONTH.map((m) => (
                                    <option key={m}>{m}월</option>
                                ))}
                            </select>
                            <ArrowSmall rotate={180} />
                        </div>

                        <div className={cx('select-item')}>
                            <select className={cx('select')}>
                                {DAY.map((d) => (
                                    <option key={d}>{d}일</option>
                                ))}
                            </select>
                            <ArrowSmall rotate={180} />
                        </div>
                    </div>
                </div>


                <div className={cx("input-title")}>휴대폰 번호 인증</div>
                <VerifyPhone />

                <div className={cx('check-box-wrapper')}>
                    <CheckBox
                        allCheckTitle={'모두 동의합니다.'}
                        checkListProps={checkList}
                        box={true}
                        setterFunc={setCheckList}
                    />
                </div>
            </div>

            <FixedButton
                button_name={'회원가입하기'}
                disable={signUp}
                onClick={onClickSignUp}
            />
        </>
    );
};

export default SignUpContainer;
