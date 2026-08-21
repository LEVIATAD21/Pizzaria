// MDPSecurity - Módulo de segurança e sessão
window.MDPSecurity = (function() {
  const SESSION_KEY = 'mdp_session';
  
  function getSession() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  }
  
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  return {
    getSession: getSession,
    clearSession: clearSession,
    escapeHtml: escapeHtml
  };
})();
