import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const ProfileTab = () => {
  // Dummy user data (you can replace this with actual state or props)
  const userObject = useSelector(state => state.auth?.user);
  console.log('User Object:', userObject);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    console.log('Logout pressed');
    // Add your logout logic here
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Icon name="user-circle" size={90} color="#555" />
        </View>
        <View style={styles.infoRow}>
          <Icon name="user" size={18} color="#333" style={styles.icon} />
          <Text style={styles.infoText}>{userObject?.user}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="briefcase" size={18} color="#333" style={styles.icon} />
          <Text style={styles.infoText}>Domain: {userObject?.domain}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="id-badge" size={18} color="#333" style={styles.icon} />
          <Text style={styles.infoText}>Code: {userObject?.code}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon
          name="sign-out"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
  },
  username: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  domain: {
    fontSize: 16,
    color: '#555',
    marginTop: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});
