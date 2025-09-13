# PowerShell Script untuk menambahkan mata kuliah Teknik Informatika Politeknik Negeri Manado
# Usage: .\seed-ti-courses.ps1

$API_BASE = "http://localhost:5001"

Write-Host "🏫 Politeknik Negeri Manado - Course Seeder" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "🌱 Adding Teknik Informatika courses..." -ForegroundColor Yellow
Write-Host ""

# Function to create course
function Create-Course {
    param(
        [string]$Code,
        [string]$Name,
        [int]$Credits,
        [int]$Semester
    )
    
    $ProgramStudy = "Teknik Informatika"
    $Description = "Mata kuliah $Name untuk Program Studi $ProgramStudy semester $Semester"
    
    Write-Host "Creating: $Code - $Name" -ForegroundColor Cyan
    
    $Body = @{
        course_code = $Code
        course_name = $Name
        description = $Description
        credits = $Credits
        semester = $Semester
        program_study = $ProgramStudy
    } | ConvertTo-Json
    
    try {
        $Response = Invoke-RestMethod -Uri "$API_BASE/api/courses" -Method POST -Body $Body -ContentType "application/json"
        if ($Response.success) {
            Write-Host "  ✅ Success" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $($Response.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host "📚 Semester 1 Courses:" -ForegroundColor Blue
Write-Host "----------------------" -ForegroundColor Blue
Create-Course "TI101" "Algoritma dan Pemrograman I" 3 1
Create-Course "TI102" "Matematika Diskrit" 3 1
Create-Course "TI103" "Pengantar Teknologi Informasi" 2 1
Create-Course "TI104" "Bahasa Inggris I" 2 1
Create-Course "TI105" "Pancasila" 2 1
Create-Course "TI106" "Sistem Digital" 3 1
Create-Course "TI107" "Fisika Dasar" 3 1

Write-Host ""
Write-Host "📚 Semester 2 Courses:" -ForegroundColor Blue
Write-Host "----------------------" -ForegroundColor Blue
Create-Course "TI201" "Algoritma dan Pemrograman II" 3 2
Create-Course "TI202" "Struktur Data" 3 2
Create-Course "TI203" "Matematika Terapan" 3 2
Create-Course "TI204" "Bahasa Inggris II" 2 2
Create-Course "TI205" "Kewarganegaraan" 2 2
Create-Course "TI206" "Organisasi dan Arsitektur Komputer" 3 2
Create-Course "TI207" "Elektronika Dasar" 3 2

Write-Host ""
Write-Host "📚 Semester 3 Courses:" -ForegroundColor Blue
Write-Host "----------------------" -ForegroundColor Blue
Create-Course "TI301" "Pemrograman Berorientasi Objek" 3 3
Create-Course "TI302" "Basis Data I" 3 3
Create-Course "TI303" "Sistem Operasi" 3 3
Create-Course "TI304" "Jaringan Komputer I" 3 3
Create-Course "TI305" "Statistika dan Probabilitas" 3 3
Create-Course "TI306" "Interaksi Manusia dan Komputer" 2 3
Create-Course "TI307" "Bahasa Indonesia" 2 3

Write-Host ""
Write-Host "📚 Semester 4 Courses:" -ForegroundColor Blue
Write-Host "----------------------" -ForegroundColor Blue
Create-Course "TI401" "Rekayasa Perangkat Lunak" 3 4
Create-Course "TI402" "Basis Data II" 3 4
Create-Course "TI403" "Pemrograman Web I" 3 4
Create-Course "TI404" "Jaringan Komputer II" 3 4
Create-Course "TI405" "Analisis dan Perancangan Sistem" 3 4
Create-Course "TI406" "Metodologi Penelitian" 2 4
Create-Course "TI407" "Grafika Komputer" 3 4

Write-Host ""
Write-Host "📚 Semester 5 Courses:" -ForegroundColor Blue
Write-Host "----------------------" -ForegroundColor Blue
Create-Course "TI501" "Pemrograman Web II" 3 5
Create-Course "TI502" "Keamanan Jaringan" 3 5
Create-Course "TI503" "Kecerdasan Buatan" 3 5
Create-Course "TI504" "Data Mining" 3 5
Create-Course "TI505" "Mobile Programming" 3 5
Create-Course "TI506" "E-Commerce" 2 5
Create-Course "TI507" "Sistem Informasi Manajemen" 3 5

Write-Host ""
Write-Host "📚 Semester 6 Courses:" -ForegroundColor Blue
Write-Host "----------------------" -ForegroundColor Blue
Create-Course "TI601" "Kerja Praktik" 2 6
Create-Course "TI602" "Proyek Akhir" 4 6
Create-Course "TI603" "Sistem Terdistribusi" 3 6
Create-Course "TI604" "Cloud Computing" 3 6
Create-Course "TI605" "Internet of Things (IoT)" 3 6
Create-Course "TI606" "Teknologi Multimedia" 3 6
Create-Course "TI607" "Kewirausahaan" 2 6

Write-Host ""
Write-Host "🎉 Course seeding completed!" -ForegroundColor Green
Write-Host "✅ Attempted to add 35 courses for Teknik Informatika" -ForegroundColor Green
Write-Host ""
Write-Host "📋 To verify, check the courses in your application or run:" -ForegroundColor Yellow
Write-Host "curl '$API_BASE/api/courses?program_study=Teknik%20Informatika&limit=50'" -ForegroundColor Gray