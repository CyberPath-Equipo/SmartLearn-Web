    function paginaPrincipal(){
      window.location.href = 'smartLearn.html';
    }

    function logout(){
      localStorage.removeItem('sessionUser');
      paginaPrincipal();
    }

    function perfilUser(){
      window.location.href = "usuario.html";
    }