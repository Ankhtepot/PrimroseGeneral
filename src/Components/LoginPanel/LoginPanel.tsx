import React, { useState, useContext } from 'react';
import styles from './LoginPanel.module.scss';
import { AdministrationContext } from '../../store/contexts';
import ButtonCommon from '../ButtonCommon/ButtonCommon';
import { Lock, User, Loader2 } from 'lucide-react';

function LoginPanel() {
    const { login, isLoggingInInProgress, isLastLoginFailed } = useContext(AdministrationContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        login(username, password);
    };

    const isInputValid = username.length > 3 && password.length > 5;

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                {isLastLoginFailed &&
                    <p className={styles.lastLoginFailed}>Username or password are wrong, please, check.</p>}
                <h2>Login</h2>
                <p>Enter your credentials to access the application.</p>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">
                            <User size={18} />
                            <span>Username</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            disabled={isLoggingInInProgress}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">
                            <Lock size={18} />
                            <span>Password</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            disabled={isLoggingInInProgress}
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <ButtonCommon 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={isLoggingInInProgress || !isInputValid}
                    >
                        {isLoggingInInProgress ? (
                            <>
                                <Loader2 className={styles.spinning} size={18} />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </ButtonCommon>
                </form>
            </div>
        </div>
    );
}

export default LoginPanel;