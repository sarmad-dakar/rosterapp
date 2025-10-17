import { Platform, StyleSheet } from 'react-native';
import { vh, vw } from '../../utils/units';

export const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    height: vh * 5.5,
    width: '90%',
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: '3%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: vh * 0.82,
  },
  smallContainer: { height: 35, marginVertical: 5, borderRadius: 7 },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    width: '80%',
    height: '100%',
    alignSelf: 'center',
    fontSize: vh * 1.32,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    marginTop: 3,
  },
  rightContainer: {
    width: vh * 2.7,
    height: vh * 2.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
    tintColor: 'black',
  },
  iconContainer: {
    width: vh * 3.5,
    height: vh * 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -vw * 0.5,
  },
  error: {
    color: 'red',
    fontSize: vh * 1.52,
  },
  label: {
    fontSize: vh * 1.52,
    marginTop: 10,
    marginBottom: Platform.OS === 'ios' ? vh * 2 : 3,
  },
});
