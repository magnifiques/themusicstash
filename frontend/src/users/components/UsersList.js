import React from 'react';
import UsersItem from './UsersItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';

const UsersList = ({ items }) => {


  
  if (items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {items.map(item => (
        <UsersItem
          key={item.id}
          id={item.id}
          image={item.image}
          name={item.name}
          albums={item.albums.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
