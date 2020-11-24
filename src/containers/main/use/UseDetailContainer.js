import React from 'react';
// import qs from 'qs';
// import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';

// import { Paths } from '../../../paths';

import styles from './UseDetailContainer.module.scss';

import Parking from '../../../static/asset/png/parking.png';

import Tel from '../../../static/asset/svg/use/Tel';
import MessageBox from '../../../static/asset/svg/use/MessageBox';

const cx = classNames.bind(styles);

const Info = ({ attribute, value, black }) => {
    return (
        <div className={cx('attribute-wrapper')}>
            <div className={cx('attribute')}>{attribute}</div>
            <div className={cx('value', { black: black })}>{value}</div>
        </div>
    );
};

const Button = ({ name, children }) => {
    return (
        <ButtonBase>
            {children}
            {name}
        </ButtonBase>
    );
};

const UseDetailContainer = ({ location }) => {
    // const query = qs.parse(location.search, {
    //     ignoreQueryPrefix: true,
    // });

    // const { id } = query;

    return (
        <>
            <div className={cx('container')}>
                <div className={cx('title')}>길동이의 주차 공간</div>
                <div className={cx('card')}>
                    <img src={Parking} alt="" />

                    <div className={cx('card-title')}>주차 대여 정보</div>

                    <div className={cx('content-area')}>
                        <Info
                            attribute={'주차 공간 이름'}
                            value={'길동이 주차공간'}
                        />
                        <Info
                            attribute={'대여시간'}
                            value={'10/05(수) 14:00 ~ 10/05(수) 16:00'}
                            black={true}
                        />
                        <Info
                            attribute={'운영시간'}
                            value={'10/05(수) 09:00 ~ 10/05(수) 16:00'}
                        />
                        <Info
                            attribute={'주차요금'}
                            value={'30분당 3,000원'}
                            black={true}
                        />
                        <Info
                            attribute={'제공자 연락처'}
                            value={'0504-123-1234'}
                            black={true}
                        />
                        <Info
                            attribute={'이전 대여자 연락처'}
                            value={'0504-123-1234'}
                        />
                    </div>

                    <div className={cx('button-area')}>
                        <Button name={'고객센터 연결'}>
                            <Tel />
                        </Button>
                        <Button name={'리뷰 작성 하기'}>
                            <MessageBox />
                        </Button>
                    </div>
                </div>
            </div>

            <div className={cx("bar")} />

            {/* <div className={cx("container")}>
                <div classNames={cx("discount-area")}>
                    <div className={cx("discount-wrapper")}>할인 정보</div>
                    <div className={cx('content-area')}>
                        <Info
                            attribute={"사용 쿠폰"}
                            value={"오픈 이벤트 10% 할인 쿠폰"}
                        />
                        <Info
                            attribute={"쿠폰 할인"}
                            value={"- 1,000원"}
                            black={true}
                        />
                        <Info
                            attribute={"포인트 사용"}
                            value={"- 1,000원"}
                            black={true}
                        />
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default UseDetailContainer;
