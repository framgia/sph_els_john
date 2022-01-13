import { useEffect, useState } from 'react';

import { UserListData } from '.';

import {
  fetchUsers,
  followUser,
  unfollowUser,
  fetchUserWithFollows,
} from '../../actions';
import { StoreState } from '../../reducers';
import { connect } from 'react-redux';
import { User } from '../AdminUser';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import { CircularProgress, Stack } from '@mui/material';

interface Props {
  fetchUsers: Function;
  followUser: Function;
  unfollowUser: Function;
  fetchUserWithFollows: Function;
  usersWithFollows: User[];
}

export const UserList = ({
  fetchUsers,
  followUser,
  unfollowUser,
  fetchUserWithFollows,
  usersWithFollows,
}: Props): JSX.Element => {
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUserWithFollows({
      token: cookies.token,
      callback: () => {
        fetchUsers({
          callback: () => {
            setLoading(false);
          },
        });
      },
    });
  }, [fetchUsers, fetchUserWithFollows, cookies]);

  const handleFollowClick = (
    e: any,
    params: GridRenderCellParams,
    callback: Function = () => {}
  ) => {
    let rowId = params.id;
    let data = {
      user_id: rowId,
      token: cookies.token,
      callback: callback,
    };
    params.row.is_following ? unfollowUser(data) : followUser(data);
    fetchUserWithFollows({ token: cookies.token });
  };

  return (
    <div className="container mx-auto mt-20 h-screen">
      {loading && (
        <Stack alignItems="center" className="mb-5">
          <CircularProgress />
        </Stack>
      )}
      <div className="flex mx-auto h-4/6 w-1/2 ">
        <div className="flex-grow">
          <UserListData
            usersWithFollows={usersWithFollows}
            handleFollowClick={handleFollowClick}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userData,
  usersData,
}: StoreState): { usersWithFollows: User[] } => {
  const logged_in_user = userData.data;
  const users = usersData.data || [];

  let following = userData.data?.following || [];
  let following_ids: number[] = following?.map((f) => f['to_id']);

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#for_adding_and_removing_items_during_a_map
  const usersWithFollows = users.flatMap((user) => {
    if (logged_in_user?.id === user.id) return [];

    if (typeof user['is_following'] === 'undefined') {
      return { ...user, is_following: following_ids.includes(user['id']) };
    }

    return { ...user, is_following: user['is_following'] };
  });
  return { usersWithFollows };
};

export default connect(mapStateToProps, {
  fetchUserWithFollows,
  fetchUsers,
  followUser,
  unfollowUser,
})(UserList);
