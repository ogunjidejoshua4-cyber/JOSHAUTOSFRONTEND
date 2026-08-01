import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    background: '#0f172a',
    color: '#ffffff',
    confirmButtonColor: '#3b82f6',
    customClass: {
      popup: 'border border-slate-700 rounded-xl'
    }
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title: title || 'Action Failed',
    text: text,
    background: '#0f172a',
    color: '#ffffff',
    confirmButtonColor: '#ef4444',
  });
};

export const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#ffffff',
  });

  Toast.fire({
    icon: icon,
    title: title
  });
};