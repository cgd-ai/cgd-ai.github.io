set terminal png transparent size 640,240
set size 1.0,1.0

set terminal png transparent size 640,480
set output 'lines_of_code_by_author.png'
set key left top
set yrange [0:]
set xdata time
set timefmt "%s"
set format x "%Y-%m-%d"
set grid y
set ylabel "Lines"
set xtics rotate
set bmargin 6
plot 'lines_of_code_by_author.dat' using 1:2 title "cgd_lab" w lines, 'lines_of_code_by_author.dat' using 1:3 title "cgd_T460P_u16" w lines, 'lines_of_code_by_author.dat' using 1:4 title "plf" w lines, 'lines_of_code_by_author.dat' using 1:5 title "shunyi" w lines, 'lines_of_code_by_author.dat' using 1:6 title "ysys" w lines, 'lines_of_code_by_author.dat' using 1:7 title "ysy" w lines, 'lines_of_code_by_author.dat' using 1:8 title "ChenYuAn" w lines, 'lines_of_code_by_author.dat' using 1:9 title "Macchiato" w lines, 'lines_of_code_by_author.dat' using 1:10 title "Server-Titan" w lines, 'lines_of_code_by_author.dat' using 1:11 title "cgd_lab_u16" w lines, 'lines_of_code_by_author.dat' using 1:12 title "wpc_lab" w lines, 'lines_of_code_by_author.dat' using 1:13 title "Server-1" w lines, 'lines_of_code_by_author.dat' using 1:14 title "u16-VM" w lines, 'lines_of_code_by_author.dat' using 1:15 title "plf_s2" w lines, 'lines_of_code_by_author.dat' using 1:16 title "yaoshunyi" w lines, 'lines_of_code_by_author.dat' using 1:17 title "xupei" w lines, 'lines_of_code_by_author.dat' using 1:18 title "wpc" w lines, 'lines_of_code_by_author.dat' using 1:19 title "plf_s1" w lines, 'lines_of_code_by_author.dat' using 1:20 title "Server-2" w lines, 'lines_of_code_by_author.dat' using 1:21 title "qiuqc" w lines
