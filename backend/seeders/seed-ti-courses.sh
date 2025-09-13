#!/bin/bash

# Script untuk menambahkan mata kuliah Teknik Informatika Politeknik Negeri Manado
# Usage: bash seed-ti-courses.sh

API_BASE="http://localhost:5001"

echo "🏫 Politeknik Negeri Manado - Course Seeder"
echo "================================================"
echo "🌱 Adding Teknik Informatika courses..."
echo ""

# Function to create course
create_course() {
    local code=$1
    local name=$2
    local credits=$3
    local semester=$4
    local program_study="Teknik Informatika"
    local description="Mata kuliah $name untuk Program Studi $program_study semester $semester"

    echo "Creating: $code - $name"
    
    curl -s -X POST "$API_BASE/api/courses" \
        -H "Content-Type: application/json" \
        -d "{
            \"course_code\": \"$code\",
            \"course_name\": \"$name\",
            \"description\": \"$description\",
            \"credits\": $credits,
            \"semester\": $semester,
            \"program_study\": \"$program_study\"
        }" | jq -r '.message // .success // "API Error"'
    
    sleep 0.2
}

echo "📚 Semester 1 Courses:"
echo "----------------------"
create_course "TI101" "Algoritma dan Pemrograman I" 3 1
create_course "TI102" "Matematika Diskrit" 3 1
create_course "TI103" "Pengantar Teknologi Informasi" 2 1
create_course "TI104" "Bahasa Inggris I" 2 1
create_course "TI105" "Pancasila" 2 1
create_course "TI106" "Sistem Digital" 3 1
create_course "TI107" "Fisika Dasar" 3 1

echo ""
echo "📚 Semester 2 Courses:"
echo "----------------------"
create_course "TI201" "Algoritma dan Pemrograman II" 3 2
create_course "TI202" "Struktur Data" 3 2
create_course "TI203" "Matematika Terapan" 3 2
create_course "TI204" "Bahasa Inggris II" 2 2
create_course "TI205" "Kewarganegaraan" 2 2
create_course "TI206" "Organisasi dan Arsitektur Komputer" 3 2
create_course "TI207" "Elektronika Dasar" 3 2

echo ""
echo "📚 Semester 3 Courses:"
echo "----------------------"
create_course "TI301" "Pemrograman Berorientasi Objek" 3 3
create_course "TI302" "Basis Data I" 3 3
create_course "TI303" "Sistem Operasi" 3 3
create_course "TI304" "Jaringan Komputer I" 3 3
create_course "TI305" "Statistika dan Probabilitas" 3 3
create_course "TI306" "Interaksi Manusia dan Komputer" 2 3
create_course "TI307" "Bahasa Indonesia" 2 3

echo ""
echo "📚 Semester 4 Courses:"
echo "----------------------"
create_course "TI401" "Rekayasa Perangkat Lunak" 3 4
create_course "TI402" "Basis Data II" 3 4
create_course "TI403" "Pemrograman Web I" 3 4
create_course "TI404" "Jaringan Komputer II" 3 4
create_course "TI405" "Analisis dan Perancangan Sistem" 3 4
create_course "TI406" "Metodologi Penelitian" 2 4
create_course "TI407" "Grafika Komputer" 3 4

echo ""
echo "📚 Semester 5 Courses:"
echo "----------------------"
create_course "TI501" "Pemrograman Web II" 3 5
create_course "TI502" "Keamanan Jaringan" 3 5
create_course "TI503" "Kecerdasan Buatan" 3 5
create_course "TI504" "Data Mining" 3 5
create_course "TI505" "Mobile Programming" 3 5
create_course "TI506" "E-Commerce" 2 5
create_course "TI507" "Sistem Informasi Manajemen" 3 5

echo ""
echo "📚 Semester 6 Courses:"
echo "----------------------"
create_course "TI601" "Kerja Praktik" 2 6
create_course "TI602" "Proyek Akhir" 4 6
create_course "TI603" "Sistem Terdistribusi" 3 6
create_course "TI604" "Cloud Computing" 3 6
create_course "TI605" "Internet of Things (IoT)" 3 6
create_course "TI606" "Teknologi Multimedia" 3 6
create_course "TI607" "Kewirausahaan" 2 6

echo ""
echo "🎉 Course seeding completed!"
echo "✅ Added 35 courses for Teknik Informatika"
echo ""
echo "📋 To verify, check the courses in your application or run:"
echo "curl '$API_BASE/api/courses?program_study=Teknik%20Informatika&limit=50'"