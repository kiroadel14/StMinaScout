// ▼▼▼▼▼ (1) كود مفاتيح الفايربيز (النسخة الصح 100%) ▼▼▼▼▼
const firebaseConfig = {
  apiKey: "AIzaSyDdFviarXRaceGWrFOpLHILHIlLjfvBsy0",
  authDomain: "stminascouts-def45.firebaseapp.com",
  projectId: "stminascouts-def45",
  storageBucket: "stminascouts-def45.firebasestorage.app",
  messagingSenderId: "859400563718",
  appId: "1:859400563718:web:8bebeb450b95035fed2787",
  measurementId: "G-04176SW9XV"
};

// تهيئة الفايربيز
// (شيلنا كود جوجل من هنا)
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // لعمليات التسجيل والدخول
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const db = firebase.firestore(); // لعمليات تخزين البيانات (زي الاسم)

// ▲▲▲▲▲ (1) كود مفاتيح الفايربيز (انتهى) ▲▲▲▲▲


// ▼▼▼▼▼ (2) العقل الذكي (بيشتغل في كل الصفحات) ▼▼▼▼▼
document.addEventListener('DOMContentLoaded', () => {

    // --- (أ) كود المنيو بتاع الموبايل ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if(navLinks) navLinks.classList.toggle('active');
        });
    }

    // --- (ب) كود مراقبة حالة المستخدم (أهم كود - النسخة المُصلحة) ---
    const loginBtn = document.getElementById('login-btn-li');
    const welcomeMsg = document.getElementById('user-welcome-li');
    const logoutBtn = document.getElementById('logout-btn-li');
    
    const isProtectedPage = document.body.classList.contains('protected');
    const authWall = document.getElementById('auth-wall');
    const protectedContent = document.getElementById('protected-content');

    auth.onAuthStateChanged(user => {
        if (user) {
            // --- (الحالة 1: المستخدم مسجل دخوله) ---
            
            // 1. إظهار وإخفاء الأزرار
            if (loginBtn) loginBtn.style.display = 'none';
            if (welcomeMsg) welcomeMsg.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'flex';

            // 2. جلب اسم المستخدم وعرضه (مع التأكد إننا مش في صفحة التسجيل)
            if (welcomeMsg && document.body.id !== 'register-page') {
                const welcomeText = welcomeMsg.querySelector('span');
                // (هنا بنجيب الاسم من الداتابيز أو من البروفايل)
                if (user.displayName) {
                    welcomeText.textContent = 'أهلاً يا ' + user.displayName.split(' ')[0]; 
                } else {
                    db.collection('users').doc(user.uid).get().then(doc => {
                        if (doc.exists) {
                            welcomeText.textContent = 'أهلاً يا ' + doc.data().name.split(' ')[0];
                        } else {
                            welcomeText.textContent = 'أهلاً بك';
                        }
                    }).catch(() => {
                        welcomeText.textContent = 'أهلاً بك';
                    });
                }
            }

            // 3. (تصليح جدار الحماية)
            if (isProtectedPage) {
                if (authWall) authWall.style.display = 'none';
                if (protectedContent) protectedContent.style.display = 'block'; // (إظهار المحتوى السري)
            }

        } else {
            // --- (الحالة 2: المستخدم زائر) ---

            // 1. إظهار وإخفاء الأزرار
            if (loginBtn) loginBtn.style.display = 'flex';
            if (welcomeMsg) welcomeMsg.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            
            // 2. (تصليح جدار الحماية)
            if (isProtectedPage) {
                if (authWall) authWall.style.display = 'flex'; // (إظهار جدار الحماية)
                if (protectedContent) protectedContent.style.display = 'none'; // (إخفاء المحتوى السري)
            }
        }
    });

    // --- (ج) كود زرار تسجيل الخروج ---
    if (logoutBtn) {
        // (استخدام 'click' بدل 'addEventListener' لضمان عدم التكرار)
        logoutBtn.onclick = () => {
            if (confirm('هل أنت متأكد أنك تريد تسجيل الخروج؟')) {
                auth.signOut().then(() => {
                    window.location.href = 'index.html'; 
                }).catch((error) => {
                    console.error('خطأ أثناء تسجيل الخروج:', error);
                });
            }
        };
    }

// ▲▲▲▲▲ (2) العقل الذكي (انتهى) ▲▲▲▲▲


// ▼▼▼▼▼ (3) كود صفحة التسجيل (بيشتغل في register.html بس) ▼▼▼▼▼

    if (document.body.id === 'register-page') {
        
        const loginTab = document.querySelector('.tab-btn[onclick*="login"]');
        const signupTab = document.querySelector('.tab-btn[onclick*="signup"]');
        const loginForm = document.getElementById('login');
        const signupForm = document.getElementById('signup');

        window.showTab = (tabName) => {
            hideMessages();
            
            if (tabName === 'login') {
                if(loginForm) loginForm.classList.add('active');
                if(signupForm) signupForm.classList.remove('active');
                if(loginTab) loginTab.classList.add('active');
                if(signupTab) signupTab.classList.remove('active');
            } else {
                if(loginForm) loginForm.classList.remove('active');
                if(signupForm) signupForm.classList.add('active');
                if(loginTab) loginTab.classList.remove('active');
                if(signupTab) signupTab.classList.add('active');
            }
        }
        
        const signupFormElement = document.getElementById('signup-form');
        const signupMessage = document.getElementById('signup-message');

        if(signupFormElement) {
            signupFormElement.addEventListener('submit', (e) => {
                e.preventDefault(); 
                hideMessages();
                
                const name = document.getElementById('signup-name').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;

                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        
                        // (تحديث اسم المستخدم في البروفايل)
                        user.updateProfile({
                            displayName: name 
                        });

                        // (تخزين الاسم في الداتابيز)
                        db.collection('users').doc(user.uid).set({
                            name: name,
                            email: email,
                            joinedAt: new Date()
                        })
                        .then(() => {
                            showMessage(signupMessage, 'تم إنشاء حسابك بنجاح! أهلاً بك يا ' + name.split(' ')[0], 'success');
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 2000);
                        });
                    })
                    .catch((error) => {
                        showMessage(signupMessage, translateFirebaseError(error.code), 'error');
                    });
            });
        }

        const loginFormElement = document.getElementById('login-form');
        const loginMessage = document.getElementById('login-message');

        if(loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                hideMessages();

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        showMessage(loginMessage, 'أهلاً بعودتك! جاري نقلك...', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    })
                    .catch((error) => {
                        showMessage(loginMessage, translateFirebaseError(error.code), 'error');
                    });
            });
        }
        
        // --- (تم شيل كل أكواد جوجل من هنا) ---

        const forgotPasswordLink = document.getElementById('forgot-password-link');
        if(forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                hideMessages();
                
                const email = document.getElementById('login-email').value;
                if (!email) {
                    showMessage(loginMessage, 'من فضلك اكتب إيميلك في الخانة المخصصة أولاً.', 'error');
                    return;
                }

                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        showMessage(loginMessage, 'تم إرسال رابط إعادة تعيين كلمة المرور على إيميلك. (شيك على الـ Spam لو ملقتهوش)', 'success');
                    })
                    .catch((error) => {
                        showMessage(loginMessage, translateFirebaseError(error.code), 'error');
                    });
            });
        }

        function showMessage(element, message, type) {
            if(element) {
                element.textContent = message;
                element.className = 'message-box ' + type; // 'error' or 'success'
                element.style.display = 'block';
            }
        }
        function hideMessages() {
            document.querySelectorAll('.message-box').forEach(box => {
                box.style.display = 'none';
                box.textContent = '';
            });
        }
        
        function translateFirebaseError(errorCode) {
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    return 'هذا البريد الإلكتروني مسجل بالفعل.';
                case 'auth/invalid-email':
                    return 'البريد الإلكتروني غير صحيح.';
                case 'auth/weak-password':
                    return 'كلمة المرور ضعيفة جداً (يجب أن تكون 6 حروف على الأقل).';
                case 'auth/user-not-found':
                case 'auth/invalid-credential': 
                    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
                case 'auth/wrong-password':
                    return 'كلمة المرور غير صحيحة.';
                case 'auth/too-many-requests':
                    return 'لقد حاولت الدخول مرات كثيرة. حاول مرة أخرى لاحقاً.';
                // (شيلنا أكواد جوجل)
                case 'auth/operation-not-allowed':
                    return 'التسجيل بهذه الطريقة غير مفعّل. (خطأ من طرف مسؤول الموقع)';
                default:
                    console.error("Firebase Error: ", errorCode); 
                    return 'كلمة المرور غير صحيحة، حاول مجددًا';
            }
        }
    }
// ▲▲▲▲▲ (3) كود صفحة التسجيل (انتهى) ▲▲▲▲▲

});

function openVideo() {
    const popup = document.getElementById("videoPopup");
    if (!popup) return;

    const video = popup.querySelector("video");

    popup.style.display = "block";   

    if (video) {
        video.currentTime = 0;      
        video.muted = false;        
        video.play();              
    }
}
function closeVideo() {
    const popup = document.getElementById("videoPopup");
    if (!popup) return;

    const video = popup.querySelector("video");

    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    popup.style.display = "none";
}
function closeImage(e) {
    if (e) e.stopPropagation();
    document.getElementById('imageModal').style.display = 'none';
}

document.querySelectorAll('.gallery-item img').forEach(img => {
    img.onclick = function () {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');

        modal.style.display = 'flex';
        modalImg.src = this.src;
    };
});

