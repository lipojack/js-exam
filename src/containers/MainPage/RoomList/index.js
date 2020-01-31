import React from 'react';
import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Card, Avatar, Tag, Icon } from 'antd';
import { SpringGrid, measureItems, makeResponsive } from 'react-stonecutter';
import { formatTime } from 'utils/format';

import avatarIcon1 from 'asset/image/avatar1.png';
import avatarIcon2 from 'asset/image/avatar2.png';
import avatarIcon3 from 'asset/image/avatar3.png';
import avatarIcon4 from 'asset/image/avatar4.png';
import style from './RoomList.module.scss';

const { Meta } = Card;
const Grid = makeResponsive(measureItems(SpringGrid), {
  maxWidth: 1920,
  minPadding: 100,
});
const AVATAR_LIST = [avatarIcon1, avatarIcon2, avatarIcon3, avatarIcon4];

const RoomList = ({ rooms = [], signedOn, hostings, triggerDelRoom }) => {
  const handleDelButton = (room, event) => {
    event.preventDefault();
    event.stopPropagation();
    triggerDelRoom(room);
  };

  return (
    <Grid
      className={style.list}
      component="ul"
      columns={5}
      columnWidth={270}
      gutterWidth={5}
      gutterHeight={5}
      itemHeight={200}
      springConfig={{ stiffness: 170, damping: 26 }}
    >
      {rooms.map(room => {
        const avatarIndex =
          Math.floor((room.description.slice(-2) % 10) / 3) || 0;

        return (
          <li key={room.id} className={style.listItem}>
            {signedOn && includes(hostings, room.id) && (
              <Tag className={style.tag} color="#108ee9">
                Host
              </Tag>
            )}
            <Link
              to={{
                pathname: `/admin/dispatch/${room.id}`,
              }}
            >
              <Card
                hoverable
                cover={
                  <div className={style.cover}>
                    <span className={style.room}>Room</span>
                    {room.description}
                    {signedOn && includes(hostings, room.id) && (
                      <button
                        type="button"
                        className={style.floatTop}
                        onClick={e => handleDelButton(room, e)}
                      >
                        <Icon
                          type="delete"
                          theme="twoTone"
                          twoToneColor="#f00"
                        />
                      </button>
                    )}
                  </div>
                }
              >
                <Meta
                  avatar={<Avatar src={AVATAR_LIST[avatarIndex]} />}
                  title={room.subjectId}
                  description={formatTime(room.createTime)}
                />
              </Card>
            </Link>
          </li>
        );
      })}
    </Grid>
  );
};

RoomList.propTypes = {
  rooms: PropTypes.array,
  signedOn: PropTypes.bool,
  hostings: PropTypes.array,
  triggerDelRoom: PropTypes.func,
};

export default RoomList;
