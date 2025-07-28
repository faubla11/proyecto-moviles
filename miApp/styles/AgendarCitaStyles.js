// AgendarCitaStyles.js
import { Platform } from 'react-native';

export const agendarCitaStyles = {
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  formWrapper: {
    width: Platform.OS === 'web' ? '60%' : '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
  },
  snackbar: {
    backgroundColor: '#4CAF50',
    marginTop: 20,
    borderRadius: 10,
    alignSelf: 'center',
    maxWidth: '100%',
  },
  snackbarText: {
    color: 'white',
    fontWeight: 'bold',
  },
};
