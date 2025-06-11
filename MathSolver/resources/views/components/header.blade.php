<header>
    <span class="header-logo logo">Math.<span class="green-text">In</span></span>
    <!-- Saat Sudah Login -->
    <div class="link-group">
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('write') }}">Write</a>
        <a href="{{ route('saved') }}">History</a>
    </div>
    <!-- Bila Belum Login -->
    <div class="head-auth" id="headerAuthButtons" style="display: none;">
        <button onclick="location.href='{{ route('login') }}'" class="button btn-white">Login</a>
        <button onclick="location.href='{{ route('register') }}'" class="btn-green">Signup</button>
    </div>
    <!-- Bila Sudah Login -->
    <div class="profil-area" id="headerProfileArea" style="display: none;">
        <span class="profil-name" id="headerUserNameDisplay">Budi</span>
        <div class="profil-image"  onclick="toggleOverlay()">
            <img src="{{ asset('images/profil-icon.webp') }}" alt="profile">
            <!-- Overlay Menu -->
            <div class="profil-overlay" id="profilOverlay">
                <button onclick="logout()" class="logout-button">Log Out</button>
            </div>
        </div>
    </div>
</header>

@push('scripts')
    <script src="{{ asset('js/logout.js') }}"></script>
@endpush