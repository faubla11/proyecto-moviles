import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centro horizontal
    backgroundColor: '#f2f4f8',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  inputOutline: {
    borderRadius: 12,
  },
  button: {
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
  },
  link: {
    marginTop: 15,
    fontSize: 14,
    color: '#6200ee',
    textAlign: 'center',
  },
});
