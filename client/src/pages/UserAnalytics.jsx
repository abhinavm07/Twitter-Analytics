import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {twtUsers, reset} from '../features/tweetOfUser/tweetOfUserSlice'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'
import SentimentSearchResults from '../components/SentimentSearchResults.jsx'
import {IoAnalytics, IoSearch} from "react-icons/all.js";
import SearchBar from "../components/SearchBar.jsx";
import {Tooltip} from 'react-tooltip'
import Modal from "../components/Modal.jsx";
import {Charts} from "../components/Charts.jsx";


const UserAnalytics = () => {
    const [formData, setFormData] = useState({
        twtUsername: '',
    })

    const {twtUsername} = formData
    const dispatch = useDispatch()

    const [tweetContextModal, setTweetContextModal] = useState({
        visible: false,
        title: '',
        body: '',
    });

    const [tweetBreakdownModal, setTweetBreakdownModal] = useState({
        visible: false,
        title: 'Tweets Context Breakdown',
        body: '',
    });

    const {twtUser, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.tweetuser
    )
    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        dispatch(reset())
    }, [dispatch, isError, message])

    const onSubmit = (e) => {
        e.preventDefault()
        const twtuserName = {twtUsername}
        dispatch(twtUsers(twtuserName))
    }
    const onChange = (e) => {
        setFormData((prevstate) => ({
            ...prevstate,
            [e.target.name]: e.target.value,
        }))
    }
    if (isLoading) {
        return <Spinner/>
    }

    function getClassName(sentiment = 'neutral') {
        return `tweetbox sentiment-${sentiment}`;
    }

    function openTweetContext(tweet) {
        setTweetContextModal({
            visible: tweet?.context ? true : false,
            title: 'Tweet Context',
            body: tweet?.context?.toString(),
        });
    }

    function getBreakdownChart(tweets) {
        if (!tweets) return;

        const extraOptions = {
            height: '400',
            width: '700',
        }
        const breakdownOption = {
            label: 'Breakdown',
        };

        return <Charts chartOptions={breakdownOption} data={tweets} extraOptions={extraOptions}/>
    }


    return (
        <>
            <div className='sidecontainer'>
                <SearchBar
                    onSubmit={onSubmit}
                    value={twtUsername}
                    onChange={onChange}
                    name='twtUsername'
                    id='twtUsername'
                    placeholder='Search here'
                    disabled={!twtUsername}
                    type='text'
                    icon='@'
                    buttonIcon={<IoSearch/>}
                />
                {twtUser?.userData && <div className='meta-user-details'>
                    <div className='grid grid-cols-4 gap-4 mt-2'>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Followers
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Following
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Tweets
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col meta-user-info'>
                                Breakdown
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-4 mt-2'>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small'>
                                {twtUser?.userData?.data?.public_metrics?.followers_count}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small'>
                                {twtUser?.userData?.data?.public_metrics?.following_count}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small'>
                                {twtUser?.userData?.data?.public_metrics?.tweet_count}
                            </div>
                        </div>
                        <div className='col-span-1'>
                            <div className='flex flex-col user-detail-small' id='tweet-breakdown-chart-tooltip'
                                 onClick={() => setTweetBreakdownModal({
                                     visible: true,
                                     title: 'Tweets Context Breakdown',
                                     body: getBreakdownChart(twtUser?.contextVolume),
                                 })}>
                                &#8644;
                            </div>
                            <Tooltip anchorId='tweet-breakdown-chart-tooltip'
                                     content='Click here to see the tweet breakdown'/>
                        </div>
                    </div>
                </div>
                }
            </div>
            {twtUser?.userData && <div className='flex flex-col'>
                <div>
                    <br/>
                    <div className='w-full flex '>
                    </div>
                    {/* end of avatar  */}
                    <br/>
                    <div className='user-tweet-details'>
                        <div className='flex '>
                        </div>
                        <div className='recent-tweets'>
                            <div className='justify-center'>
                                <div className='carousel carousel-vertical rounded-box all-tweet-list'>
                                    {twtUser?.twtData?.map((data, index) => (
                                        <div className='carousel-item recent-tweet' key={index}>
                                            <div className={getClassName(data.sentiment)}>
                                                <div className='warning-banner'>
                                                    <div
                                                        className='flex justify-center items-center h-10 w-full my-10'
                                                        id={index + "_tweet-sentiment"}
                                                    >
                                                        <SentimentSearchResults emotion={data.sentiment} key={data.id}/>
                                                    </div>
                                                </div>
                                                {/*<Tooltip anchorId={index + '_tweet-sentiment'}*/}
                                                {/*         content={'Sentiment of this tweet is ' + data.sentiment}*/}
                                                {/*/>*/}
                                                <div className='avatar-username'>
                                                    <div className='avatar'>
                                                        <img
                                                            src='https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png'/>
                                                    </div>
                                                    <div className='username-box'>
                                                <span className='name'>
                                                 {twtUser?.userData?.data?.name}
                                                </span>
                                                        <p className='username'>
                                                            {twtUser?.userData?.data?.username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='tweet'
                                                     onClick={() => openTweetContext(data)}>
                                                    <span id={index + "_tweet-context"}>{data.tweet}</span>
                                                </div>
                                                {<Tooltip anchorId={index + '_tweet-context'}
                                                          content={data?.context ? 'Click to see the tweet context' : 'No context available'}/>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            {
                tweetContextModal.visible &&
                <Modal context={tweetContextModal} close={() => setTweetContextModal({visible: false})}/>
            }
            {
                tweetBreakdownModal.visible &&
                <Modal context={tweetBreakdownModal} close={() => setTweetBreakdownModal({visible: false})}/>
            }
        </>
    )
}

export default UserAnalytics
