/*global Kakao*/
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './DetailContainer.module.scss';
import cn from 'classnames/bind';

//components
import Shared from '../../components/shared/Shared';
import ReviewRating from '../../components/review/ReviewRating';
import CircleButton from '../../components/button/CircleButton';
import CustomTabs from '../../components/nav/CustomTabs';
import LikeButton from '../../components/button/LikeButton';
import DetailReviewList from '../../components/review/DetailReviewItem';
import DatePickerModal from '../../components/modal/DatePickerModal';
import RoadviewModal from '../../components/modal/RoadviewModal';
import FixedButton from '../../components/button/FixedButton';
//asset
import guid_icon from '../../static/asset/svg/detail/guid.svg';
import roadview_icon from '../../static/asset/svg/detail/roadview.svg';
import shared_icon from '../../static/asset/svg/detail/shared.svg';
import datepicker_icon from '../../static/asset/svg/detail/time_filter.svg';
import { ButtonBase, IconButton } from '@material-ui/core';
import { Paths } from '../../paths';
import Arrow from '../../static/asset/svg/Arrow';

//api
import { requestGetDetailParking } from '../../api/place';
import {
    requestGetLike,
    requestPostLike,
    requestDeleteLike,
} from '../../api/like';

//lib
import { getFormatDateTime, calculatePrice } from '../../lib/calculateDate';
import { numberFormat } from '../../lib/formatter';

//hooks
import useLoading from '../../hooks/useLoading';
import useModal from '../../hooks/useModal';
import { useDialog } from '../../hooks/useDialog';

const cx = cn.bind(styles);
const getParkingType = (type) => {
    switch (type) {
        case 0:
            return '주차타운';
        case 1:
            return '주차타운';
        case 2:
            return '주차타운';
        default:
            return '지정주차';
    }
};
const DetailContainer = ({ modal, place_id }) => {
    const { user_id } = useSelector((state) => state.user);
    const history = useHistory();
    const location = useLocation();
    const openDialog = useDialog();

    const [openDatePicker, onClickDatePicker] = useModal(
        location.pathname,
        modal,
        `datapicker?place_id=${place_id}`,
    );
    const [openLoadview, onClickRoadview] = useModal(
        location.pathname,
        modal,
        `roadview?place_id=${place_id}`,
    );

    const [onLoading, offLoading] = useLoading();
    const [index, setIndex] = useState(0);
    const [start_date, setStartDate] = useState(null);
    const [end_date, setEndDate] = useState(null);
    const [total_date, setTotalDate] = useState(0);
    const [price, setPrice] = useState(0);
    const [place, setPlace] = useState(null);
    const [likes, setLikes] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [shareOpen, setShareOpen] = useState(false);
    const [likeStatus, setLikeStatus] = useState(false);

    const headerRef = useRef(null);
    const [headerOn, setHeaderOn] = useState(false);
    useEffect(() => {
        const headerHeight = headerRef.current.getBoundingClientRect().height;
        const headerControll = () => setHeaderOn(window.scrollY > headerHeight);
        window.addEventListener('scroll', headerControll);
        return () => window.removeEventListener('scroll', headerControll);
    }, []);

    // 상세보기 할 주차공간 api 호출
    const callGetDetailParking = useCallback(async () => {
        onLoading('detail');
        try {
            const res = await requestGetDetailParking(place_id);
            if (res.data.msg === 'success') {
                const { likes, place, reviews } = res.data;
                console.log(reviews);
                setPlace(place);
                setLikes(likes);
                setReviews(reviews);
            }
        } catch (e) {}
        offLoading('detail');
    }, [offLoading, onLoading, place_id]);

    const onClickSetDate = useCallback((start_date, end_date, total_date) => {
        setStartDate(start_date);
        setEndDate(end_date);
        setTotalDate(total_date);
    }, []);

    // 카카오 내비게이션 실행
    const onClickKakaoNavi = useCallback(() => {
        if (place) {
            Kakao.Navi.start({
                name: place.addr, // 도착지 지번
                x: parseFloat(place.lng), //도착지 x좌표
                y: parseFloat(place.lat), //도착지 y 좌표
                coordType: 'wgs84',
            });
        }
    }, [place]);

    const likeCheck = useCallback(async () => {
        const JWT_TOKEN = localStorage.getItem('user_id');
        if (JWT_TOKEN) {
            try {
                const { msg, status } = await requestGetLike(
                    JWT_TOKEN,
                    place_id,
                );
                if (msg === 'success') {
                    setLikeStatus(status);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [place_id]);

    const handleLikeStatus = useCallback(async () => {
        const JWT_TOKEN = localStorage.getItem('user_id');
        if (JWT_TOKEN) {
            try {
                const { msg, status } = await (likeStatus
                    ? requestDeleteLike(JWT_TOKEN, place_id)
                    : requestPostLike(JWT_TOKEN, place_id));
                if (msg === 'success') {
                    setLikeStatus(status);
                    setLikes((likes) => (status ? likes + 1 : likes - 1));
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            openDialog(
                '로그인 후 이용가능합니다.',
                '',
                () => history.push(Paths.auth.login),
                true,
            );
        }
    }, [history, likeStatus, openDialog, place_id]);

    const handleShare = useCallback(() => setShareOpen((state) => !state), []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(callGetDetailParking, []);
    useEffect(likeCheck, [likeCheck]);
    useEffect(() => {
        if (total_date) {
            setPrice(calculatePrice(total_date, place.place_fee));
        }
    }, [total_date, place]);
    return (
        <>
            <div className={cx('header', { headerOn })} ref={headerRef}>
                <div className={styles['content']}>
                    <IconButton
                        className={styles['back-btn']}
                        onClick={() => history.goBack()}
                    >
                        <Arrow />
                    </IconButton>
                    <div className={styles['title']}>
                        {place && place.place_name}
                    </div>
                </div>
            </div>
            <div className={styles['wrapper']}>
                <IconButton
                    className={styles['back']}
                    onClick={() => history.goBack()}
                >
                    <Arrow white={true}></Arrow>
                </IconButton>
                {place && (
                    <div
                        className={styles['parking-img']}
                        style={{
                            backgroundImage: `url('${Paths.storage}${
                                place &&
                                place.place_images[0].replace('uploads/', '')
                            }')`,
                        }}
                    />
                )}
                <div className={styles['container']}>
                    <div className={styles['pd-box']}>
                        <div className={styles['item-table']}>
                            <div className={styles['item-name']}>
                                <h1>{place && place.place_name}</h1>
                                <div className={styles['item-state']}>
                                    대여가능
                                </div>
                            </div>
                            <div className={styles['item-rating']}>
                                <ReviewRating rating={reviews.length ? 
                                    reviews.reduce((prev, cur) => prev + parseFloat(cur.review_rating), 0) / reviews.length
                                    : 0.0
                                } />
                                <div className={styles['item-review']}>
                                    리뷰({reviews.length})
                                </div>
                            </div>
                            <div className={styles['function-box']}>
                                <CircleButton
                                    src={shared_icon}
                                    txt={'공유'}
                                    onClick={handleShare}
                                />
                                <CircleButton
                                    src={guid_icon}
                                    txt={'안내'}
                                    onClick={onClickKakaoNavi}
                                />
                                <CircleButton
                                    src={roadview_icon}
                                    txt={'로드뷰'}
                                    onClick={onClickRoadview}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles['parking-detail-info']}>
                        <div className={cx('price', 'space-between')}>
                            <div className={styles['txt']}>주차요금</div>
                            <div className={styles['value']}>
                                <div className={styles['item-price']}>
                                    {numberFormat(place && place.place_fee)}원
                                </div>
                                <div className={styles['item-base-time']}>
                                    /30분 기준
                                </div>
                            </div>
                        </div>
                        <div className={cx('shared-time', 'space-between')}>
                            <div className={styles['txt']}>대여시간</div>
                            <div className={styles['value']}>
                                {start_date && end_date
                                    ? start_date.DAY + ' ~ ' + end_date.DAY
                                    : '대여시간을 설정해주세요'}
                                <ButtonBase
                                    className={styles['date-picker']}
                                    onClick={onClickDatePicker}
                                >
                                    <img src={datepicker_icon} alt="date" />
                                </ButtonBase>
                            </div>
                        </div>
                        <div className={cx('operation-time', 'space-between')}>
                            <div className={styles['txt']}>운영시간</div>
                            <div className={styles['value']}>
                                {place &&
                                    `${getFormatDateTime(
                                        place.oper_start_time,
                                    )} ~  ${getFormatDateTime(
                                        place.oper_end_time,
                                    )}`}
                            </div>
                        </div>
                    </div>
                    <div className={styles['tab-wrapper']}>
                        <CustomTabs
                            idx={index}
                            categories={[
                                { ca_name: '정보' },
                                { ca_name: '리뷰' },
                            ]}
                            onChange={(e, index) => setIndex(index)}
                        />
                        {index === 0 && (
                            <div className={styles['detail-info']}>
                                <InfoItem
                                    txt={'주소'}
                                    value={place && place.addr}
                                />
                                <InfoItem
                                    txt={'주차장 종류'}
                                    value={getParkingType(
                                        place && place.place_type,
                                    )}
                                />
                                <InfoItem
                                    txt={'추가 요금'}
                                    value={`30분당 ${numberFormat(
                                        place && place.place_fee,
                                    )}원`}
                                />
                                <InfoItem
                                    txt={'추가 전달 사항'}
                                    value={place && place.place_comment}
                                />
                            </div>
                        )}
                        {index === 1 && (
                            <div className={styles['review-list']}>
                                <DetailReviewList review_list={reviews} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {place &&
                (place.user_id === user_id ? (
                    <FixedButton
                        button_name={'수정하기'}
                        disable={false}
                        onClick={() =>
                            history.push(
                                `${Paths.main.parking.enrollment}?place_id=${place.place_id}`,
                            )
                        }
                    ></FixedButton>
                ) : (
                    <LikeButton
                        likes={likes}
                        button_name={
                            start_date && end_date
                                ? `${numberFormat(price)}원 대여신청`
                                : '대여시간을 설정해 주세요.'
                        }
                        disable={start_date ? false : true}
                        likeStatus={likeStatus}
                        handleLike={handleLikeStatus}
                        onClick={() =>
                            history.push(
                                Paths.main.payment +
                                    `?place_id=${place_id}&start_time=${start_date.DATE} ${start_date.TIME}&end_time=${end_date.DATE} ${end_date.TIME}`,
                            )
                        }
                    />
                ))}
            <DatePickerModal
                open={openDatePicker}
                handleClose={() => history.goBack()}
                start_date={start_date}
                end_date={end_date}
                oper_start={place && place.oper_start_time}
                oper_end={place && place.oper_end_time}
                onClick={onClickSetDate}
            />
            <RoadviewModal
                open={openLoadview}
                handleClose={() => history.goBack()}
                title={place && place.place_name}
                lat={place && place.lat}
                lng={place && place.lng}
            />
            <Shared
                open={shareOpen}
                onToggle={handleShare}
                placeInfo={place}
            ></Shared>
        </>
    );
};

const InfoItem = ({ txt, value }) => {
    return (
        <div className={styles['info-item']}>
            <div className={styles['txt']}>{txt}</div>
            <div className={styles['value']}>{value}</div>
        </div>
    );
};

export default DetailContainer;
