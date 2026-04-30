let currentUser = null;
let currentRejectId = null;
let issues = []; 
let subscription = null;
let supabaseClient = null;
let currentLanguage = localStorage.getItem('language') || 'lo';

// ============================================
// Translations
// ============================================
const translations = {
    lo: {
        login_title: 'ເຂົ້າສູ່ລະບົບ',
        email_placeholder: 'ອີເມວ (Email)',
        password_placeholder: 'ລະຫັດຜ່ານ (Password)',
        forgot_password: 'ລືມລະຫັດຜ່ານ?',
        forgot_title: 'ກູ້ຄືນລະຫັດຜ່ານ',
        forgot_desc: 'ກະລຸນາປ້ອນອີເມວຂອງທ່ານ ລະບົບຈະສົ່ງລິ້ງກູ້ຄືນລະຫັດຜ່ານໄປໃຫ້',
        send_reset_link: 'ສົ່ງລິ້ງກູ້ຄືນ',
        role_reporter: 'ຜູ້ລາຍງານ (Reporter)',
        role_repairer: 'ຜູ້ຊ້ອມແປງ (Repairer)',
        login_btn: 'ເຂົ້າສູ່ລະບົບ',
        login_error: 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
        reset_sent: 'ລິ້ງກູ້ຄືນລະຫັດຜ່ານຖືກສົ່ງໄປໃຫ້ອີເມວຂອງທ່ານແລ້ວ',
        welcome: 'ສະບາຍດີ',
        logout: 'ອອກຈາກລະບົບ',
        new_report_title: 'ເພີ່ມລາຍງານບັນຫາໃໝ່',
        issue_placeholder: 'ເນື້ອໃນການລາຍງານບັນຫາ...',
        send_report: 'ສົ່ງລາຍງານ',
        tab_latest: 'ລາຍການບັນຫາຫຼ້າສຸດ',
        tab_history: 'ປະຫວັດການຊ້ອມແປງ',
        latest_issues: 'ລາຍການບັນຫາຫຼ້າສຸດ',
        show: 'ສະແດງ',
        rows: 'ແຖວ',
        all: 'ທັງໝົດ',
        start_date: 'ເລີ່ມວັນທີ:',
        to: 'ຫາ:',
        download_pdf: 'ດາວໂຫຼດ PDF',
        download_excel: 'ດາວໂຫຼດ Excel',
        col_no: 'ລຳດັບ',
        col_report_date: 'ວັນທີລາຍງານ',
        col_content: 'ເນື້ອໃນບັນຫາ',
        col_reported_by: 'ລາຍງານໂດຍ',
        col_repair_date: 'ວັນທີຊ້ອມແປງ',
        col_repaired_by: 'ຊ້ອມແປງໂດຍ',
        col_manage: 'ຈັດການ',
        col_status: 'ສະຖານະ',
        history_title: 'ປະຫວັດການຊ້ອມແປງ',
        reject_title: 'ລະບຸເຫດຜົນການປະຕິເສດ',
        reject_placeholder: 'ກະລຸນາປ້ອນເຫດຜົນທີ່ທ່ານປະຕິເສດວຽກນີ້...',
        confirm_reject: 'ຢືນຢັນການປະຕິເສດ',
        confirm_edit: 'ບັນທຶກ',
        cancel: 'ຍົກເລີກ',
        select_date_range: 'ເລືອກຊ່ວງວັນທີ',
        date_range_desc: 'ກະລຸນາເລືອກວັນທີເລີ່ມຕົ້ນ ແລະ ວັນທີສິ້ນສຸດ',
        confirm_download: 'ດາວໂຫຼດ',
        edit_title: 'ແກ້ໄຂລາຍງານ',
        edit_placeholder: 'ເນື້ອໃນການລາຍງານບັນຫາ...',
        role_reporter_display: 'ຜູ້ລາຍງານ',
        role_repairer_display: 'ຜູ້ຊ້ອມແປງ',
        status_pending: 'ລໍຖ້າການກວດສອບ',
        status_repairing: 'ກຳລັງຊ້ອມແປງ',
        status_paused: 'ຢຸດຊົ່ວຄາວ',
        status_done: 'ຊ້ອມແປງສຳເລັດ',
        status_rejected: 'ຖືກປະຕິເສດ',
        alert_no_user: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້',
        alert_no_content: 'ກະລຸນາປ້ອນເນື້ອໃນບັນຫາ',
        alert_busy: 'ທ່ານກຳລັງມີວຽກຊ້ອມແປງອື່ນທີ່ຍັງບໍ່ທັນຢຸດ ຫຼື ສຳເລັດ. ກະລຸນາຈັດການວຽກເກົ່າກ່ອນ.',
        alert_no_duration: 'ກະລຸນາປ້ອນເວລາຊ້ອມແປງເປັນນາທີ',
        alert_no_reject_reason: 'ກະລຸນາປ້ອນເຫດຜົນການປະຕິເສດ',
        alert_no_data: 'ບໍ່ມີຂໍ້ມູນໃນຊ່ວງວັນທີທີ່ເລືອກ',
        alert_edit_pending_only: 'ສາມາດແກ້ໄຂໄດ້ເຉີ່ຍເມື່ອຍັງລໍຖ້າຢູ່',
        alert_edit_own_only: 'ສາມາດແກ້ໄຂໄດ້ເຉີ່ຍລາຍງານຂອງຕົນເອງ',
        alert_delete_pending_only: 'ສາມາດລົບໄດ້ເຉີ່ຍເມື່ອຍັງລໍຖ້າຢູ່',
        alert_delete_own_only: 'ສາມາດລົບໄດ້ເຉີ່ຍລາຍງານຂອງຕົນເອງ',
        alert_not_pending: 'ລາຍການນີ້ບໍ່ແມ່ນສະຖານະລໍຖ້າແລ້ວ',
        confirm_delete: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບລາຍງານນີ້?',
        alert_save_error: 'ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້',
        alert_update_error: 'ບໍ່ສາມາດອັບເດັດຂໍ້ມູນໄດ້',
        alert_reject_error: 'ບໍ່ສາມາດບັນທຶກການປະຕິເສດໄດ້',
        alert_pause_error: 'ບໍ່ສາມາດຢຸດວຽກໄດ້',
        alert_resume_error: 'ບໍ່ສາມາດສືບຕໍ່ວຽກໄດ້',
        alert_complete_error: 'ບໍ່ສາມາດບັນທຶກການສຳເລັດໄດ້',
        action_start_repair: 'ເລີ່ມຊ້ອມແປງ',
        action_reject: 'ປະຕິເສດວຽກ',
        action_pause: 'ຢຸດຊົ່ວຄາວ',
        action_resume: 'ສືບຕໍ່ແປງ',
        action_complete: 'ສຳເລັດການຊ້ອມແປງ',
        action_edit: 'ແກ້ໄຂ',
        action_delete: 'ລົບ',
        action_repairing_by: '(ກຳລັງເຮັດໂດຍ:',
        action_no_action: '- ບໍ່ມີການດຳເນີນການ -',
        action_rejected: '- ປະຕິເສດແລ້ວ -',
        timer_remaining: 'ເວລາຊ້ອມແປງຍັງເຫຼືອ:',
        notification_new: 'ມີລາຍງານບັນຫາໃໝ່!',
        rejection_reason_label: 'ເຫດຜົນ:'
    },
    en: {
        login_title: 'Login',
        email_placeholder: 'Email',
        password_placeholder: 'Password',
        forgot_password: 'Forgot password?',
        forgot_title: 'Reset Password',
        forgot_desc: 'Please enter your email. We will send a password reset link.',
        send_reset_link: 'Send Reset Link',
        role_reporter: 'Reporter',
        role_repairer: 'Repairer',
        login_btn: 'Login',
        login_error: 'Invalid email or password',
        reset_sent: 'Password reset link has been sent to your email',
        welcome: 'Welcome',
        logout: 'Logout',
        new_report_title: 'Add New Issue Report',
        issue_placeholder: 'Describe the issue...',
        send_report: 'Send Report',
        tab_latest: 'Latest Issues',
        tab_history: 'Repair History',
        latest_issues: 'Latest Issues',
        show: 'Show',
        rows: 'rows',
        all: 'All',
        start_date: 'From:',
        to: 'To:',
        download_pdf: 'Download PDF',
        download_excel: 'Download Excel',
        col_no: 'No.',
        col_report_date: 'Report Date',
        col_content: 'Issue Content',
        col_reported_by: 'Reported By',
        col_repair_date: 'Repair Date',
        col_repaired_by: 'Repaired By',
        col_manage: 'Manage',
        col_status: 'Status',
        history_title: 'Repair History',
        reject_title: 'Reason for Rejection',
        reject_placeholder: 'Please enter the reason for rejecting this job...',
        confirm_reject: 'Confirm Reject',
        confirm_edit: 'Save',
        cancel: 'Cancel',
        select_date_range: 'Select Date Range',
        date_range_desc: 'Please select start and end dates',
        confirm_download: 'Download',
        edit_title: 'Edit Report',
        edit_placeholder: 'Describe the issue...',
        role_reporter_display: 'Reporter',
        role_repairer_display: 'Repairer',
        status_pending: 'Pending Review',
        status_repairing: 'Repairing',
        status_paused: 'Paused',
        status_done: 'Completed',
        status_rejected: 'Rejected',
        alert_no_user: 'Please enter username',
        alert_no_content: 'Please enter issue description',
        alert_busy: 'You have another repair job in progress. Please complete it first.',
        alert_no_duration: 'Please enter repair duration in minutes',
        alert_no_reject_reason: 'Please enter rejection reason',
        alert_no_data: 'No data found for selected date range',
        alert_edit_pending_only: 'Can only edit pending issues',
        alert_edit_own_only: 'Can only edit your own reports',
        alert_delete_pending_only: 'Can only delete pending issues',
        alert_delete_own_only: 'Can only delete your own reports',
        alert_not_pending: 'Issue is no longer pending',
        confirm_delete: 'Are you sure you want to delete this report?',
        alert_save_error: 'Unable to save data',
        alert_update_error: 'Unable to update data',
        alert_reject_error: 'Unable to save rejection',
        alert_pause_error: 'Unable to pause job',
        alert_resume_error: 'Unable to resume job',
        alert_complete_error: 'Unable to complete job',
        action_start_repair: 'Start Repair',
        action_reject: 'Reject Job',
        action_pause: 'Pause',
        action_resume: 'Resume Repair',
        action_complete: 'Complete Repair',
        action_edit: 'Edit',
        action_delete: 'Delete',
        action_repairing_by: '(Repairing by:',
        action_no_action: '- No action -',
        action_rejected: '- Rejected -',
        timer_remaining: 'Time remaining:',
        notification_new: 'New issue reported!',
        rejection_reason_label: 'Reason:'
    }
};

// Change language function
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.getElementById('languageSelector').value = lang;
    applyTranslations();
    renderIssues();
    updateRoleDisplay();
}

// Get translated text
function t(key) {
    return translations[currentLanguage][key] || translations['lo'][key] || key;
}

// Apply translations to all elements
function applyTranslations() {
    // Translate elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        el.textContent = t(key);
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        el.placeholder = t(key);
    });
    
    // Update document title
    document.title = currentLanguage === 'en' ? 'Issue Reporting & Repair System' : 'ລະບົບແຈ້ງບັນຫາ ແລະ ສ້ອມແປງ';
}

// Update role display text
function updateRoleDisplay() {
    if (!currentUser) return;
    const roleText = currentUser.role === 'repairer' ? t('role_repairer_display') : t('role_reporter_display');
    document.getElementById('displayRole').textContent = roleText;
}

// Use global variables from supabase-config.js

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize language
    document.getElementById('languageSelector').value = currentLanguage;
    applyTranslations();
    
    console.log('Initializing Supabase...');
    console.log('URL:', window.SUPABASE_URL);
    console.log('Key exists:', !!window.SUPABASE_ANON_KEY);
    
    if (typeof window.supabase !== 'undefined') {
        try {
            supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
            console.log('Supabase client created');
            
            // Check for existing session (this will subscribe if logged in)
            await checkSession();

            // ດັກຈັບ Event ເມື່ອຜູ້ໃຊ້ກົດ Link ຈາກ Email ກູ້ຄືນລະຫັດ
            supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'PASSWORD_RECOVERY') {
                    console.log('User clicked password recovery link');
                    openNewPasswordModal();
                }
            });
            
            // Only load issues if no session (otherwise checkSession will load)
            if (!currentUser) {
                await loadIssues();
            }
            // Note: subscription is handled in login() or checkSession() when user is authenticated
        } catch (err) {
            console.error('Failed to create Supabase client:', err);
            alert(t('alert_save_error') + ': ' + err.message);
        }
    } else {
        console.error('Supabase library not loaded');
        alert('Unable to load Supabase library');
    }
});

// Load issues from Supabase
async function loadIssues() {
    if (!supabaseClient) return;
    
    try {
        const { data, error } = await supabaseClient
            .from(window.TABLE_NAME)
            .select('*')
            .order('id', { ascending: false });
        
        if (error) {
            console.error('Error loading issues:', error);
            return;
        }
        
        issues = data || [];
        if (currentUser) renderIssues();
    } catch (err) {
        console.error('Error:', err);
    }
}

// Subscribe to real-time changes
function subscribeToIssues() {
    if (!supabaseClient) return;
    
    // Prevent duplicate subscriptions
    if (subscription) {
        console.log('Already subscribed, skipping...');
        return;
    }
    
    console.log('Setting up real-time subscription...');
    
    subscription = supabaseClient
        .channel('issues_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: window.TABLE_NAME }, (payload) => {
            console.log('Real-time update received:', payload);
            console.log('Event type:', payload.eventType);
            console.log('Updated data:', payload.new);
            loadIssues(); // Reload when data changes
            
            // Show notification for new issues
            if (payload.eventType === 'INSERT' && currentUser) {
                const newIssue = payload.new;
                if (newIssue.reportedby !== currentUser.name) {
                    sendNotification(
                        'ມີລາຍງານໃໝ່',
                        `${newIssue.reportedby}: ${newIssue.content.substring(0, 50)}...`
                    );
                }
            }
        })
        .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
                const indicator = document.getElementById('realtimeStatus');
                if (indicator) indicator.style.display = 'inline-flex';
            }
        });
    
    console.log('Real-time subscription active!');
}

// ຂໍອະນຸຍາດແຈ້ງເຕືອນ Browser
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) return alert(t('alert_no_user'));

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Login error:', error);
            alert(t('login_error'));
            return;
        }

        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError || !profile) {
            console.error('Profile error:', profileError);
            alert('ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ / User profile not found');
            return;
        }

        currentUser = { 
            id: data.user.id,
            email: data.user.email,
            name: profile.full_name || data.user.email,
            role: profile.role 
        };

        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('appSection').classList.remove('hidden');
        document.getElementById('displayUser').innerText = currentUser.name;
        document.getElementById('displayRole').innerText = currentUser.role === 'repairer' ? t('role_repairer_display') : t('role_reporter_display');

        if (currentUser.role === 'reporter') {
            document.getElementById('reporterForm').classList.remove('hidden');
        }
        
        await loadIssues();
        subscribeToIssues(); // Start real-time subscription
        switchTab('latest');
    } catch (err) {
        console.error('Login error:', err);
        alert(t('login_error'));
    }
}

async function logout() {
    // Unsubscribe from real-time updates
    if (subscription) {
        await supabaseClient.removeChannel(subscription);
        subscription = null;
        console.log('Real-time subscription removed');
    }
    
    // Hide real-time indicator
    const indicator = document.getElementById('realtimeStatus');
    if (indicator) indicator.style.display = 'none';
    
    await supabaseClient.auth.signOut();
    currentUser = null;
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('appSection').classList.add('hidden');
    document.getElementById('reporterForm').classList.add('hidden');
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

// Check for existing session on page load
async function checkSession() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (session) {
            // Get user profile
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                currentUser = { 
                    id: session.user.id,
                    email: session.user.email,
                    name: profile.full_name || session.user.email,
                    role: profile.role 
                };

                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('appSection').classList.remove('hidden');
                document.getElementById('displayUser').innerText = currentUser.name;
                document.getElementById('displayRole').innerText = currentUser.role === 'repairer' ? t('role_repairer_display') : t('role_reporter_display');

                if (currentUser.role === 'reporter') {
                    document.getElementById('reporterForm').classList.remove('hidden');
                }
                
                await loadIssues();
                subscribeToIssues(); // Start real-time subscription
                switchTab('latest');
            }
        }
    } catch (err) {
        console.error('Session check error:', err);
    }
}

// Forgot password functions (OTP Version - supports multiple simultaneous resets)
function openForgotPasswordModal() {
    document.getElementById('forgotEmail').value = '';
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
}

function openNewPasswordModal() {
    document.getElementById('newPasswordInput').value = '';
    document.getElementById('confirmPasswordInput').value = '';
    document.getElementById('newPasswordModal').classList.remove('hidden');
}

function closeNewPasswordModal() {
    document.getElementById('newPasswordModal').classList.add('hidden');
}

async function sendPasswordReset() {
    const email = document.getElementById('forgotEmail').value;
    if (!email) return alert(t('alert_no_user'));

    try {
        const redirectUrl = window.location.origin + window.location.pathname;
        console.log('Requesting reset with redirect to:', redirectUrl);

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        if (error) throw error;

        alert('✅ ລະບົບໄດ້ສົ່ງລິ້ງກູ້ຄືນລະຫັດຜ່ານໄປຫາ Email ຂອງທ່ານແລ້ວ.');
        closeForgotPasswordModal();
    } catch (err) {
        console.error('Reset error:', err);
        alert('ຜິດພາດ: ' + err.message);
    }
}

async function updatePassword() {
    const newPassword = document.getElementById('newPasswordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;
    
    if (newPassword.length < 6) {
        alert('ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('ລະຫັດຜ່ານບໍ່ກົງກັນ');
        return;
    }
    
    try {
        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        alert('✅ ປ່ຽນລະຫັດຜ່ານໃໝ່ສຳເລັດແລ້ວ!');
        closeNewPasswordModal();
        // ຫຼັງຈາກປ່ຽນສຳເລັດ, ໃຫ້ logout ອອກກ່ອນເພື່ອໃຫ້ຜູ້ໃຊ້ login ໃໝ່ດ້ວຍລະຫັດທີ່ຖືກຕ້ອງ
        await logout();
    } catch (err) {
        console.error('Update password error:', err);
        alert('❌ ບໍ່ສາມາດປ່ຽນລະຫັດຜ່ານໄດ້: ' + err.message);
    }
}

// Helper function to format date as DD/MM/YYYY HH:MM
function formatDateTime(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Helper function to format date as DD/MM/YYYY
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Helper function to normalize date string for table display (DD/MM/YYYY HH:MM)
function normalizeDateForTable(dateStr) {
    if (!dateStr || dateStr === '-') return '-';
    // If already in DD/MM/YYYY HH:MM format, return as is
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)) return dateStr;
    // Convert from other formats (like "4/30/2026, 11:11:18 AM" or ISO)
    try {
        return formatDateTime(new Date(dateStr));
    } catch (e) {
        return dateStr;
    }
}

function switchTab(tab) {
    const latestSec = document.getElementById('latestSection');
    const historySec = document.getElementById('historySection');
    const latestBtn = document.getElementById('tabBtnLatest');
    const historyBtn = document.getElementById('tabBtnHistory');

    if (tab === 'latest') {
        latestSec.classList.remove('hidden');
        historySec.classList.add('hidden');
        latestBtn.classList.add('active');
        historyBtn.classList.remove('active');
    } else {
        latestSec.classList.add('hidden');
        historySec.classList.remove('hidden');
        latestBtn.classList.remove('active');
        historyBtn.classList.add('active');
    }
}

async function addIssue() {
    const content = document.getElementById('issueContent').value;
    if (!content) return alert(t('alert_no_content'));

    const newIssue = {
        reportdate: formatDateTime(new Date()),
        createdat: new Date().toISOString(),
        content: content,
        reportedby: currentUser.name,
        repairdate: '-',
        repairedby: '-',
        status: 'pending',
        rejectionreason: ''
    };

    if (supabaseClient) {
        console.log('Sending to Supabase:', newIssue);
        const { data, error } = await supabaseClient.from(window.TABLE_NAME).insert([newIssue]).select();
        if (error) {
            console.error('Error adding issue:', error);
            alert(t('alert_save_error') + ': ' + error.message);
            return;
        }
        console.log('Saved:', data);
    } else {
        console.error('Supabase client not initialized');
        alert(t('alert_save_error'));
        return;
    }

    document.getElementById('issueContent').value = '';
    await loadIssues();
    
    sendNotification(t('notification_new'), content);
}

// Helper check ວ່າຜູ້ຊ້ອມແປງກຳລັງມີວຽກຄ້າງຢູ່ ຫຼື ບໍ່
function isBusy(userName) {
    return issues.some(i => i.status === 'repairing' && i.repairedby.split(', ').pop() === userName);
}

async function startRepair(id) {
    if (isBusy(currentUser.name)) {
        return alert(t('alert_busy'));
    }

    const durationInput = document.getElementById(`duration-${id}`);
    const minutes = parseInt(durationInput.value);
    
    if (!minutes || minutes <= 0) {
        return alert(t('alert_no_duration'));
    }

    const index = issues.findIndex(i => i.id === id);
    if (index !== -1) {
        const now = new Date().getTime();
        const updates = {
            status: 'repairing',
            repairedby: currentUser.name,
            estimatedendtime: now + (minutes * 60 * 1000)
        };
        
        if (supabaseClient) {
            const { error } = await supabaseClient.from(window.TABLE_NAME).update(updates).eq('id', id);
            if (error) {
                console.error('Error updating issue:', error);
                alert(t('alert_update_error'));
                return;
            }
        }
        
        await loadIssues();
    }
}

function formatDuration(ms) {
    if (ms <= 0) return "Time Out";
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((ms % (1000 * 60)) / 1000);

    let result = "";
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h:`;
    result += `${mins}m:${secs < 10 ? '0' : ''}${secs}s`;
    return result;
}

function getRemainingTime(endTime) {
    const now = new Date().getTime();
    return formatDuration(endTime - now);
}

function openRejectModal(id) {
    currentRejectId = id;
    document.getElementById('modalRejectReason').value = '';
    document.getElementById('rejectModal').classList.remove('hidden');
}

function closeRejectModal() {
    document.getElementById('rejectModal').classList.add('hidden');
    currentRejectId = null;
}

let currentEditId = null;

function openEditModal(id) {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;
    
    // Only allow editing if status is pending and user is the reporter
    if (issue.status !== 'pending') {
        return alert(t('alert_edit_pending_only'));
    }
    if (issue.reportedby !== currentUser.name) {
        return alert(t('alert_edit_own_only'));
    }
    
    currentEditId = id;
    document.getElementById('modalEditContent').value = issue.content;
    document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    currentEditId = null;
}

async function confirmEdit() {
    const newContent = document.getElementById('modalEditContent').value;
    if (!newContent) return alert(t('alert_no_content'));
    
    const index = issues.findIndex(i => i.id === currentEditId);
    if (index !== -1) {
        // Double check status is still pending
        if (issues[index].status !== 'pending') {
            closeEditModal();
            return alert(t('alert_not_pending'));
        }
        
        if (supabaseClient) {
            const { error } = await supabaseClient.from(window.TABLE_NAME)
                .update({ content: newContent })
                .eq('id', currentEditId);
            if (error) {
                console.error('Error updating issue:', error);
                alert(t('alert_update_error'));
                return;
            }
        }
        
        await loadIssues();
        closeEditModal();
    }
}

async function deleteIssue(id) {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;
    
    // Only allow deleting if status is pending and user is the reporter
    if (issue.status !== 'pending') {
        return alert(t('alert_delete_pending_only'));
    }
    if (issue.reportedby !== currentUser.name) {
        return alert(t('alert_delete_own_only'));
    }
    
    if (!confirm(t('confirm_delete'))) return;
    
    if (supabaseClient) {
        const { error } = await supabaseClient.from(window.TABLE_NAME)
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting issue:', error);
            alert(t('alert_update_error'));
            return;
        }
    }
    
    await loadIssues();
}

async function confirmReject() {
    const reason = document.getElementById('modalRejectReason').value;
    if (!reason) return alert(t('alert_no_reject_reason'));

    const index = issues.findIndex(i => i.id === currentRejectId);
    if (index !== -1) {
        const updates = {
            status: 'rejected',
            repairedby: currentUser.name,
            repairdate: formatDateTime(new Date()),
            rejectionreason: reason
        };
        
        if (supabaseClient) {
            const { error } = await supabaseClient.from(window.TABLE_NAME).update(updates).eq('id', currentRejectId);
            if (error) {
                console.error('Error rejecting issue:', error);
                alert(t('alert_reject_error'));
                return;
            }
        }
        
        await loadIssues();
        closeRejectModal();
    }
}

async function pauseRepair(id) {
    const index = issues.findIndex(i => i.id === id);
    if (index !== -1 && issues[index].status === 'repairing') {
        const now = new Date().getTime();
        const updates = {
            remainingtime: issues[index].estimatedendtime - now,
            status: 'paused'
        };
        
        if (supabaseClient) {
            const { error } = await supabaseClient.from(window.TABLE_NAME).update(updates).eq('id', id);
            if (error) {
                console.error('Error pausing repair:', error);
                alert(t('alert_pause_error'));
                return;
            }
        }
        
        await loadIssues();
    }
}

async function resumeRepair(id) {
    const index = issues.findIndex(i => i.id === id);
    if (index !== -1 && issues[index].status === 'paused') {
        const now = new Date().getTime();
        const extendInput = document.getElementById(`extend-${id}`);
        const newMinutes = extendInput ? parseInt(extendInput.value) : 0;

        let newEndTime;
        if (newMinutes > 0) {
            newEndTime = now + (newMinutes * 60 * 1000);
        } else {
            newEndTime = now + issues[index].remainingtime;
        }

        const updates = {
            estimatedendtime: newEndTime,
            status: 'repairing',
            remainingtime: null
        };

        if (supabaseClient) {
            const { error } = await supabaseClient.from(window.TABLE_NAME).update(updates).eq('id', id);
            if (error) {
                console.error('Error resuming repair:', error);
                alert(t('alert_resume_error'));
                return;
            }
        }
        
        await loadIssues();
    }
}

// ຟັງຊັນ extendRepair ຖືກລຶບອອກຢ່າງສົມບູນ

async function markRepaired(id) {
    const index = issues.findIndex(i => i.id === id);
    if (index !== -1) {
        const updates = {
            repairdate: formatDateTime(new Date()),
            repairedby: currentUser.name,
            status: 'done',
            estimatedendtime: null,
            remainingtime: null
        };
        
        if (supabaseClient) {
            const { error } = await supabaseClient.from(window.TABLE_NAME).update(updates).eq('id', id);
            if (error) {
                console.error('Error marking as repaired:', error);
                alert(t('alert_complete_error'));
                return;
            }
        }
        
        await loadIssues();
    }
}

// saveData function removed - using Supabase directly

function exportHistory(format) {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    // ເລືອກສະເພາະປະຫວັດ (ສຳເລັດ ຫຼື ປະຕິເສດ)
    let filtered = issues.filter(i => i.status === 'done' || i.status === 'rejected');

    // ກັ່ນຕອງຕາມວັນທີ
    if (start) {
        filtered = filtered.filter(i => new Date(i.createdat || i.reportdate) >= new Date(start));
    }
    if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59);
        filtered = filtered.filter(i => new Date(i.createdat || i.reportdate) <= endDate);
    }

    if (filtered.length === 0) return alert(t('alert_no_data'));

    if (format === 'excel') {
        generateExcel(filtered);
    } else {
        generatePDF(filtered, start, end);
    }
}

// Global variable to store current export format
let currentExportFormat = null;

function openExportModal(format) {
    currentExportFormat = format;
    
    // Set default dates: 7 days ago to today
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // Format for date input (YYYY-MM-DD)
    const formatForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    document.getElementById('exportStartDate').value = formatForInput(sevenDaysAgo);
    document.getElementById('exportEndDate').value = formatForInput(today);
    
    // Set up the confirm button
    const confirmBtn = document.getElementById('confirmExportBtn');
    confirmBtn.onclick = confirmExport;
    
    // Show modal
    document.getElementById('exportDateModal').classList.remove('hidden');
}

function closeExportModal() {
    document.getElementById('exportDateModal').classList.add('hidden');
    currentExportFormat = null;
}

function confirmExport() {
    const start = document.getElementById('exportStartDate').value;
    const end = document.getElementById('exportEndDate').value;
    
    if (!start || !end) {
        alert('ກະລຸນາເລືອກວັນທີເລີ່ມຕົ້ນ ແລະ ວັນທີສິ້ນສຸດ / Please select start and end dates');
        return;
    }
    
    // ເລືອກສະເພາະປະຫວັດ (ສຳເລັດ ຫຼື ປະຕິເສດ)
    let filtered = issues.filter(i => i.status === 'done' || i.status === 'rejected');

    // ກັ່ນຕອງຕາມວັນທີ
    if (start) {
        filtered = filtered.filter(i => new Date(i.createdat || i.reportdate) >= new Date(start));
    }
    if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59);
        filtered = filtered.filter(i => new Date(i.createdat || i.reportdate) <= endDate);
    }

    if (filtered.length === 0) {
        alert(t('alert_no_data'));
        return;
    }

    closeExportModal();

    if (currentExportFormat === 'excel') {
        generateExcel(filtered);
    } else {
        generatePDF(filtered, start, end);
    }
}

// Old function kept for compatibility - redirects to modal
function exportHistorySection(format) {
    openExportModal(format);
}

function generatePDF(data, startDate, endDate) {
    const element = document.createElement('div');
    element.style.padding = "20px";
    
    // Format selected date range for display
    let dateRangeText = '';
    if (startDate && endDate) {
        const startFormatted = formatDate(new Date(startDate));
        const endFormatted = formatDate(new Date(endDate));
        dateRangeText = `ວັນທີ: ${startFormatted} - ${endFormatted}`;
    }
    
    element.innerHTML = `
        <h2 style="text-align:center; font-family: 'Phetsarath OT';">ລາຍງານປະຫວັດການຊ້ອມແປງ</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <p style="margin: 0;">ວັນທີອອກລາຍງານ: ${formatDateTime(new Date())}</p>
            <p style="margin: 0; font-weight: bold;">${dateRangeText}</p>
        </div>
        <table border="1" style="width:100%; border-collapse:collapse; font-family: 'Phetsarath OT'; font-size: 11px;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th style="padding: 6px;">ລຳດັບ</th>
                    <th style="padding: 6px;">ວັນທີລາຍງານ</th>
                    <th style="padding: 6px;">ເນື້ອໃນ</th>
                    <th style="padding: 6px;">ຜູ້ລາຍງານ</th>
                    <th style="padding: 6px;">ວັນທີຊ້ອມແປງ</th>
                    <th style="padding: 6px;">ຜູ້ຊ້ອມແປງ</th>
                    <th style="padding: 6px;">ສະຖານະ</th>
                    <th style="padding: 6px;">ເຫດຜົນປະຕິເສດ</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((i, idx) => {
                    const statusText = i.status === 'done' ? t('status_done') : (i.status === 'rejected' ? t('status_rejected') : i.status);
                    const statusColor = i.status === 'done' ? '#16a34a' : (i.status === 'rejected' ? '#dc2626' : '#475569');
                    return `
                    <tr>
                        <td style="padding: 6px; text-align:center;">${idx + 1}</td>
                        <td style="padding: 6px;">${normalizeDateForTable(i.reportdate)}</td>
                        <td style="padding: 6px;">${i.content}</td>
                        <td style="padding: 6px;">${i.reportedby}</td>
                        <td style="padding: 6px;">${normalizeDateForTable(i.repairdate)}</td>
                        <td style="padding: 6px;">${i.repairedby}</td>
                        <td style="padding: 6px; color: ${statusColor}; font-weight: bold;">${statusText}</td>
                        <td style="padding: 6px; color: #dc2626;">${i.rejectionreason || '-'}</td>
                    </tr>
                `}).join('')}
            </tbody>
        </table>
    `;

    const opt = { margin: 10, filename: 'repair_history.pdf', html2canvas: { scale: 2 }, jsPDF: { orientation: 'landscape' } };
    html2pdf().set(opt).from(element).save();
}

function generateExcel(data) {
    const excelData = data.map((i, index) => ({
        "ລຳດັບ": index + 1,
        "ວັນທີລາຍງານ": normalizeDateForTable(i.reportdate),
        "ເນື້ອໃນບັນຫາ": i.content,
        "ລາຍງານໂດຍ": i.reportedby,
        "ວັນທີຊ້ອມແປງ": normalizeDateForTable(i.repairdate),
        "ຊ້ອມແປງໂດຍ": i.repairedby,
        "ສະຖານະ": i.status === 'done' ? t('status_done') : (i.status === 'rejected' ? t('status_rejected') : i.status),
        "ເຫດຜົນປະຕິເສດ": i.rejectionreason || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RepairHistory");
    XLSX.writeFile(wb, `Repair_History_${formatDateTime(new Date()).replace(/[/:]/g, '-')}.xlsx`);
}

function downloadLatestPDF() {
    // Get all issues currently showing in Latest Issues (excluding done and rejected)
    const latestIssues = issues.filter(i => i.status !== 'done' && i.status !== 'rejected');
    
    if (latestIssues.length === 0) {
        alert(t('alert_no_data'));
        return;
    }
    
    // Sort same as renderIssues
    const sortedIssues = latestIssues.sort((a, b) => {
        if (a.status === 'repairing' && b.status !== 'repairing') return -1;
        if (a.status !== 'repairing' && b.status === 'repairing') return 1;
        return b.id - a.id;
    });
    
    const element = document.createElement('div');
    element.style.padding = "20px";
    element.innerHTML = `
        <h2 style="text-align:center; font-family: 'Phetsarath OT';">ລາຍການບັນຫາຫຼ້າສຸດ</h2>
        <p style="text-align:center;">ວັນທີອອກລາຍງານ: ${formatDateTime(new Date())}</p>
        <table border="1" style="width:100%; border-collapse:collapse; font-family: 'Phetsarath OT'; font-size: 11px;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th style="padding: 6px;">ລຳດັບ</th>
                    <th style="padding: 6px;">ວັນທີລາຍງານ</th>
                    <th style="padding: 6px;">ເນື້ອໃນ</th>
                    <th style="padding: 6px;">ຜູ້ລາຍງານ</th>
                    <th style="padding: 6px;">ວັນທີຊ້ອມແປງ</th>
                    <th style="padding: 6px;">ຜູ້ຊ້ອມແປງ</th>
                    <th style="padding: 6px;">ສະຖານະ</th>
                </tr>
            </thead>
            <tbody>
                ${sortedIssues.map((i, idx) => {
                    let statusText = i.status;
                    let statusColor = '#475569';
                    if (i.status === 'pending') {
                        statusText = t('status_pending');
                        statusColor = '#dc2626';
                    } else if (i.status === 'repairing') {
                        statusText = t('status_repairing');
                        statusColor = '#d97706';
                    } else if (i.status === 'paused') {
                        statusText = t('status_paused');
                        statusColor = '#475569';
                    }
                    return `
                    <tr>
                        <td style="padding: 6px; text-align:center;">${idx + 1}</td>
                        <td style="padding: 6px;">${normalizeDateForTable(i.reportdate)}</td>
                        <td style="padding: 6px;">${i.content}</td>
                        <td style="padding: 6px;">${i.reportedby}</td>
                        <td style="padding: 6px;">${normalizeDateForTable(i.repairdate)}</td>
                        <td style="padding: 6px;">${i.repairedby}</td>
                        <td style="padding: 6px; color: ${statusColor}; font-weight: bold;">${statusText}</td>
                    </tr>
                `}).join('')}
            </tbody>
        </table>
    `;

    const opt = { margin: 10, filename: 'latest_issues.pdf', html2canvas: { scale: 2 }, jsPDF: { orientation: 'landscape' } };
    html2pdf().set(opt).from(element).save();
}

function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
    } else {
        alert(`ແຈ້ງເຕືອນ: ${title}\n${body}`);
    }
}

setInterval(() => {
    const repairingIssues = issues.some(i => i.status === 'repairing');
    if (repairingIssues && currentUser) {
        renderIssues();
    }
}, 1000);

function renderIssues() {
    const latestTbody = document.getElementById('issueTableBody');
    const historyTbody = document.getElementById('historyTableBody');
    const latestLimit = parseInt(document.getElementById('latestLimit').value);
    const historyLimit = parseInt(document.getElementById('historyLimit').value);
    
    latestTbody.innerHTML = '';
    historyTbody.innerHTML = '';

    const latestIssuesRaw = issues.filter(i => i.status !== 'done' && i.status !== 'rejected');
    const historyIssuesRaw = issues.filter(i => i.status === 'done' || i.status === 'rejected');

    const sortedLatest = latestIssuesRaw.sort((a, b) => {
        if (a.status === 'repairing' && b.status !== 'repairing') return -1;
        if (a.status !== 'repairing' && b.status === 'repairing') return 1;
        return b.id - a.id;
    }).slice(0, latestLimit);

    const sortedHistory = historyIssuesRaw.sort((a, b) => b.id - a.id).slice(0, historyLimit);

    renderTableRows(sortedLatest, latestTbody);
    renderTableRows(sortedHistory, historyTbody);
}

function renderTableRows(dataList, tbody) {
    dataList.forEach((issue, index) => {
        const tr = document.createElement('tr');
        let actionBtn = '';
        let statusHtml = '';
        
        if (issue.status === 'pending') {
            statusHtml = `<span class="badge bg-pending">${t('status_pending')}</span>`;
            if (currentUser.role === 'repairer') {
                actionBtn = `
                    <div class="action-container">
                        <div class="input-group">
                            <input type="number" id="duration-${issue.id}" placeholder="min" class="input-sm">
                            <button class="btn-repair btn-sm" onclick="startRepair(${issue.id})">${t('action_start_repair')}</button>
                        </div>
                        <button style="background:var(--danger); margin-top: 5px;" class="btn-sm" onclick="openRejectModal(${issue.id})">${t('action_reject')}</button>
                    </div>`;
            } else if (currentUser.role === 'reporter' && issue.reportedby === currentUser.name) {
                // Reporter can edit/delete their own pending issues
                actionBtn = `
                    <div class="action-container">
                        <div class="input-group">
                            <button style="background:#3b82f6;" class="btn-sm" onclick="openEditModal(${issue.id})">${t('action_edit')}</button>
                            <button style="background:var(--danger);" class="btn-sm" onclick="deleteIssue(${issue.id})">${t('action_delete')}</button>
                        </div>
                    </div>`;
            }
        } else if (issue.status === 'repairing' || issue.status === 'paused') {
            const isRepairing = issue.status === 'repairing';
            const badgeClass = isRepairing ? 'bg-repairing' : 'bg-paused';
            const timerText = isRepairing ? 
                getRemainingTime(issue.estimatedendtime) : 
                formatDuration(issue.remainingtime);
            
            statusHtml = `<div>
                <span class="badge ${badgeClass}">${isRepairing ? t('status_repairing') : t('status_paused')}</span>
                <div style="font-size: 11px; color: #475569; margin-top: 4px;">${t('timer_remaining')} <b style="color: var(--danger);">${timerText}</b></div>
            </div>`;

            if (currentUser.role === 'repairer') {
                const currentRepairer = issue.repairedby.split(', ').pop();
                const isOwner = currentRepairer === currentUser.name;

                // ຖ້າມີຄົນກຳລັງແປງຢູ່ ແລະ ບໍ່ແມ່ນເຮົາ ຈະບໍ່ສະແດງປຸ່ມຈັດການ
                if (isRepairing && !isOwner) {
                    actionBtn = `<span style="color: #94a3b8; font-size: 11px;">${t('action_repairing_by')} ${currentRepairer})</span>`;
                } else {
                    // ສະແດງປຸ່ມຈັດການຖ້າເປັນເຈົ້າຂອງວຽກ ຫຼື ວຽກນັ້ນຖືກຢຸດຊົ່ວຄາວຢູ່
                actionBtn = `
                    <div class="action-container">
                        <div class="input-group">
                            ${isRepairing ? 
                                `<button style="background:var(--warning)" class="btn-sm" onclick="pauseRepair(${issue.id})">${t('action_pause')}</button>` : 
                                `
                                <input type="number" id="extend-${issue.id}" placeholder="+min" class="input-sm">
                                <button style="background:var(--success)" class="btn-sm" onclick="resumeRepair(${issue.id})">${t('action_resume')}</button>
                                `
                            }
                        </div>
                        ${!isRepairing ? `
                            <button style="background:var(--danger); margin-top: 5px;" class="btn-sm" onclick="openRejectModal(${issue.id})">${t('action_reject')}</button>
                        ` : ''}
                        ${isRepairing ? `<button class="btn-repair btn-sm" onclick="markRepaired(${issue.id})">${t('action_complete')}</button>` : ''}
                    </div>
                `;
                }
            }
        } else if (issue.status === 'done') {
            statusHtml = `<span class="badge bg-done">${t('status_done')}</span>`;
            actionBtn = `<span style="color: #94a3b8; font-size: 12px;">${t('action_no_action')}</span>`;
        } else if (issue.status === 'rejected') {
            statusHtml = `<span class="badge bg-rejected">${t('status_rejected')}</span>`;
            actionBtn = `<span style="color: #94a3b8; font-size: 12px;">${t('action_rejected')}</span>`;
        }

        tr.innerHTML = `
            <td style="font-weight: bold; color: var(--primary);">${index + 1}</td>
            <td>${normalizeDateForTable(issue.reportdate)}</td>
            <td style="max-width: 500px; word-wrap: break-word;">
                ${issue.content}
                ${issue.status === 'rejected' ? `<div style="color:var(--danger); font-size:12px; margin-top:5px;"><b>${t('rejection_reason_label')}</b> ${issue.rejectionreason}</div>` : ''}
            </td>
            <td>${issue.reportedby}</td>
            <td>${normalizeDateForTable(issue.repairdate)}</td>
            <td>${issue.repairedby}</td>
            <td>${tbody.id === 'historyTableBody' ? statusHtml : `<div>${statusHtml}</div>${actionBtn ? `<div style="margin-top: 8px;">${actionBtn}</div>` : ''}`}</td>
        `;
        tbody.appendChild(tr);
    });
}