import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './DetailContainer.module.scss';
import cn from 'classnames/bind';

//components
import ReviewRating from '../../components/review/ReviewRating';
import CircleButton from '../../components/button/CircleButton';
import CustomTabs from '../../components/nav/CustomTabs';
import LikeButton from '../../components/button/LikeButton';
import DetailReviewItem from '../../components/review/DetailReviewItem';
import DatePickerModal from '../../components/modal/DatePickerModal';
//asset
import test_img from '../../static/asset/png/test_img.png';
import guid_icon from '../../static/asset/svg/detail/guid.svg';
import roadview_icon from '../../static/asset/svg/detail/roadview.svg';
import shared_icon from '../../static/asset/svg/detail/shared.svg';
import datepicker_icon from '../../static/asset/svg/detail/time_filter.svg';
import { ButtonBase } from '@material-ui/core';
const cx = cn.bind(styles);
const categorys = [
    {
        ca_name: '정보',
    },
    {
        ca_name: '리뷰',
    },
];

const DetailContainer = ({modal}) => {
    // requestGetDetailParking API
    // API 에서 정보와 리뷰 내용이 한번에 넘어옴
    const [index, setIndex] = useState(0);
    const history = useHistory();

    return (
        <>
            <div className={styles['parking-img']}>
                <img src={test_img} alt="img" />
            </div>
            <div className={styles['container']}>
                <div className={styles['pd-box']}>
                    <div className={styles['item-table']}>
                        <div className={styles['item-name']}>
                            <h1>길동이 주차공간</h1>
                            <div className={styles['item-state']}>대여가능</div>
                        </div>
                        <div className={styles['item-rating']}>
                            <ReviewRating rating={3} />
                            <div className={styles['item-review']}>
                                리뷰(124)
                            </div>
                        </div>
                        <div className={styles['function-box']}>
                            <CircleButton src={shared_icon} />
                            <CircleButton src={guid_icon} />
                            <CircleButton src={roadview_icon} />
                        </div>
                    </div>
                </div>
                <div className={styles['parking-detail-info']}>
                    <div className={cx('price', 'space-between')}>
                        <div className={styles['txt']}>주차요금</div>
                        <div className={styles['value']}>
                            <div className={styles['item-price']}>3,000원</div>
                            <div className={styles['item-base-time']}>
                                /30분 기준
                            </div>
                        </div>
                    </div>
                    <div className={cx('shared-time', 'space-between')}>
                        <div className={styles['txt']}>대여시간</div>
                        <div className={styles['value']}>
                            10/5(수)14:00 ~ 10/5(수)16:00
                            <ButtonBase className={styles['date-picker']}>
                            <img src={datepicker_icon} alt="date"/>
                        </ButtonBase>
                        </div>
                     
                    </div>
                    <div className={cx('operation-time', 'space-between')}>
                        <div className={styles['txt']}>운영시간</div>
                        <div className={styles['value']}>
                            10/5(수) 10:00 ~ 10/5(수) 20:00
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
                                value={'서울특별시 구로구 구로동 448, 신성빌딩'}
                            />
                            <InfoItem
                                txt={'주차장 종류'}
                                value={'지하주차장'}
                            />
                            <InfoItem
                                txt={'추가 요금'}
                                value={'30분당 3,000원'}
                            />
                            <InfoItem
                                txt={'추가 전달 사항'}
                                value={
                                    '집주인이 성격이 안좋아서 그것만 주의해주세요.뭐라하면 어플 보여주시면 됩니다'
                                }
                            />
                        </div>
                    )}
                    {index===1 &&
                    <div className={styles['review-list']}>
                        <DetailReviewItem/>
                        <DetailReviewItem/>
                        <DetailReviewItem/>
                        <DetailReviewItem/>
                    </div>
                    }
                </div>
            </div>
            <DatePickerModal open ={modal==="datepicker"} handleClose ={ ()=>history.goBack()}/>
            <LikeButton  button_name={'12,000원 대여신청'} disable={false} />
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
