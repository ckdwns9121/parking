/*global Kakao*/
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './DetailContainer.module.scss';
import cn from 'classnames/bind';

//components
import Shared from '../../components/shared/Shared'
import ReviewRating from '../../components/review/ReviewRating';
import CircleButton from '../../components/button/CircleButton';
import CustomTabs from '../../components/nav/CustomTabs';
import LikeButton from '../../components/button/LikeButton';
import DetailReviewItem from '../../components/review/DetailReviewItem';
import DatePickerModal from '../../components/modal/DatePickerModal';
import RoadviewModal from '../../components/modal/RoadviewModal';
import FixedButton from '../../components/button/FixedButton';
//asset
import test_img from '../../static/asset/png/test_img.png';
import guid_icon from '../../static/asset/svg/detail/guid.svg';
import roadview_icon from '../../static/asset/svg/detail/roadview.svg';
import shared_icon from '../../static/asset/svg/detail/shared.svg';
import datepicker_icon from '../../static/asset/svg/detail/time_filter.svg';
import { ButtonBase, IconButton } from '@material-ui/core';
import { Paths } from '../../paths';
import Arrow from '../../static/asset/svg/Arrow';

//api
import {
    requestGetDetailParking,
    requestPutLikeParking,
} from '../../api/place';

//lib
import { getFormatDateTime, calculatePrice } from '../../lib/calculateDate';
import { numberFormat } from '../../lib/formatter';

//hooks
import useLoading from '../../hooks/useLoading';
import useModal from '../../hooks/useModal';

const cx = cn.bind(styles);
const DetailContainer = ({ modal, place_id }) => {
    const { user_id } = useSelector((state) => state.user);
    const history = useHistory();
    const location = useLocation();

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
    const [openNav, onClickNav] = useModal(
        location.pathname,
        modal,
        `nav?place_id=${place_id}`,
    );

    const [loading, setLoading] = useState(false);
    const [onLoading, offLoading] = useLoading();
    const [index, setIndex] = useState(0);
    const [start_date, setStartDate] = useState(null);
    const [end_date, setEndDate] = useState(null);
    const [total_date, setTotalDate] = useState(0);
    const [price, setPrice] = useState(0);
    const [place, setPlace] = useState(null);
    const [likes, setLike] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [shareOpen, setShareOpen] = useState(false);

    // 상세보기 할 주차공간 api 호출
    const callGetDetailParking = useCallback(async () => {
        onLoading('detail');
        setLoading(true);
        try {
            const res = await requestGetDetailParking(place_id);
            console.log(res);
            if (res.data.msg === 'success') {
                const { likes, place, reviews } = res.data;
                setPlace(place);
                setLike(likes);
                setReviews(reviews);
            }
        } catch (e) {
            console.error(e);
        }
        offLoading('detail');
        setLoading(false);
    }, [offLoading, onLoading, place_id]);

    const onClickSetDate = useCallback((start_date, end_date, total_date) => {
        setStartDate(start_date);
        setEndDate(end_date);
        setTotalDate(total_date);
        console.log(total_date);
    }, []);

    // 카카오 내비게이션 실행
    const onClickKakaoNavi = useCallback(() => {
        console.log(Kakao);
        Kakao.Navi.start({
            name: '현대백화점 판교점', // 도착지 지번
            x: 127.11205203011632, //도착지 x좌표
            y: 37.39279717586919, //도착지 y 좌표
            coordType: 'wgs84',
        });
    }, []);

    const onClickLike = useCallback(async () => {
        const JWT_TOKEN = localStorage.getItem('user_id');
        if (JWT_TOKEN) {
            try {
                const res = await requestPutLikeParking(JWT_TOKEN);
            } catch (e) {}
        }
    }, []);

    const handleShare = useCallback(() => setShareOpen((state) => !state), []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(callGetDetailParking, []);
    useEffect(() => {
        if (total_date) {
            setPrice(calculatePrice(total_date, place.place_fee));
        }
    }, [total_date, place]);

    return (
        <div className={styles['wrapper']}>
            <IconButton
                className={styles['back']}
                onClick={() => history.goBack()}
            >
                <Arrow white={true}></Arrow>
            </IconButton>
            <div className={styles['parking-img']}>
                <img src={test_img} alt="img" />
            </div>
            <div className={styles['container']}>
                <div className={styles['pd-box']}>
                    <div className={styles['item-table']}>
                        <div className={styles['item-name']}>
                            <h1>{place && place.place_name}</h1>
                            <div className={styles['item-state']}>대여가능</div>
                        </div>
                        <div className={styles['item-rating']}>
                            <ReviewRating rating={3} />
                            <div className={styles['item-review']}>
                                리뷰({reviews.length})
                            </div>
                        </div>
                        <div className={styles['function-box']}>
                            <CircleButton src={shared_icon} txt={'공유'} onClick={handleShare}/>
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
                        categories={[{ ca_name: '정보' }, { ca_name: '리뷰' }]}
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
                                value={'지하주차장'}
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
                            <DetailReviewItem />
                            <DetailReviewItem />
                            <DetailReviewItem />
                            <DetailReviewItem />
                        </div>
                    )}
                </div>
            </div>
            <DatePickerModal
                open={openDatePicker}
                handleClose={() => history.goBack()}
                start_date={start_date}
                end_date={end_date}
                oper_start={place && place.oper_start_time}
                oper_end={place && place.oper_end_time}
                onClick={onClickSetDate}
            />
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
                        like={likes}
                        button_name={
                            start_date && end_date
                                ? `${numberFormat(price)}원 대여신청`
                                : '대여시간을 설정해주세요'
                        }
                        disable={start_date ? false : true}
                        onClick={() =>
                            history.push(
                                Paths.main.payment +
                                    `?place_id=${place_id}&start_time=${start_date.DATE} ${start_date.TIME}&end_time=${end_date.DATE} ${end_date.TIME}`,
                            )
                        }
                    />
                ))}

            <RoadviewModal
                open={openLoadview}
                handleClose={() => history.goBack()}
                title={place && place.place_name}
                lat={place && place.lat}
                lng={place && place.lng}
            />
            <Shared open={shareOpen} onToggle={handleShare}></Shared>
        </div>
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
