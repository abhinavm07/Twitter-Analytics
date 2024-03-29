import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { twtUsers, reset } from '../features/tweetOfUser/tweetOfUserSlice'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import SerachResult from '../components/SerachResult'

const User = () => {
  const [formData, setFormData] = useState({
    twtUsername: '',
  })

  const { twtUsername } = formData
  const dispatch = useDispatch()

  const { twtUser, isLoading, isError, isSuccess, message } = useSelector(
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
    const twtuserName = { twtUsername }
    dispatch(twtUsers(twtuserName))
  }
  const onChange = (e) => {
    setFormData((prevstate) => ({
      ...prevstate,
      [e.target.name]: e.target.value,
    }))
  }
  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className=' w-full h-full'>
        {/* <div className='flex justify-center items-center h-20 w-full my-10'>
          <SerachResult emotion={emotion} />
        </div> */}
        <form onSubmit={onSubmit} className='w-full'>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Search here'
              name='twtUsername'
              id='twtUsername'
              value={twtUsername}
              onChange={onChange}
              className='flex mx-2 input input-bordered input-info w-full'
            />
          </div>
          <button type='submit' className='btn btn-outline '>
            Search UserName
          </button>
        </form>
      </div>
      <div className='flex flex-col'>
        <div>
          <div className='w-full flex '>
            <h1 className=' items-start font-extrabold text-5xl'>
              {twtUser?.userData?.data?.name}
            </h1>
          </div>

          <br />
          <div className='flex justify-start'>
            <div className='avatar'>
              <div className='w-24 rounded'>
                <img src='/images/stock/photo-1534528741775-53994a69daeb.jpg' />
              </div>
            </div>
          </div>

          <br />
          {/* end of avatar  */}
          <div className='flex '>
            {/* start of  table */}
            <div className='overflow-x-auto mx-2 '>
              <table className='table table-compact w-full'>
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>User Stats</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Followers</td>
                    <td>
                      {twtUser?.userData?.data?.public_metrics?.followers_count}
                    </td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Following</td>
                    <td>
                      {twtUser?.userData?.data?.public_metrics?.following_count}
                    </td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>Tweets</td>
                    <td>
                      {twtUser?.userData?.data?.public_metrics?.tweet_count}
                    </td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>Replies</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>5</th>
                    <td>Likes</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>6</th>
                    <td>Account Status</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* end of  table */}
          </div>
        </div>

        <div className='flex flex-col '>
          <div className='flex justify-start'>
            <div className='avatar'>
              <div className='w-96 rounded'>
                <img src='/images/stock/photo-1534528741775-53994a69daeb.jpg' />
              </div>
            </div>
          </div>

          <div className=''>
            <p> Tweets</p>
            <div className='justify-center'>
              {twtUser?.twtData?.map((data) => (
                <div className='h-96 carousel carousel-vertical rounded-box'>
                  <div className='carousel-item h-full'>
                    <div>{data.tweet}</div>
                    {/* <div className='flex justify-center items-center h-20 w-full my-10'>
                    <SerachResult emotion={data.sentiment} />
                  </div>  */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default User
