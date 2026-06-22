function toggleSupportModal() {
            const modal = document.getElementById('supportModal');
            if (modal.style.display === 'none' || !modal.style.display) {
                modal.style.display = 'flex';
                document.getElementById('supportMsg').value = '';
            } else {
                modal.style.display = 'none';
            }
        }

        function submitSupport() {
            const type = document.getElementById('supportType').value;
            const msg = document.getElementById('supportMsg').value.trim();
            if (!msg) {
                alert("Please enter your message!");
                return;
            }
            
            let millerInfo = 'Unknown User';
            try {
                const selectEl = document.getElementById('millerSelect');
                if (selectEl && selectEl.value !== 'combined' && window.dashboardData && window.dashboardData[selectEl.value]) {
                    millerInfo = window.dashboardData[selectEl.value].name;
                } else {
                    millerInfo = 'Combined Dashboard Viewer';
                }
            } catch(e) {}
            
            const adminWhatsApp = "919000000000"; // You can replace this with your actual WhatsApp number
            const text = `*New App Feedback*\n\n*Topic:* ${type}\n*User:* ${millerInfo}\n\n*Message:*\n${msg}`;
            const encodedText = encodeURIComponent(text);
            
            window.open(`https://wa.me/${adminWhatsApp}?text=${encodedText}`, '_blank');
            toggleSupportModal();
        }


        // Language Toggle Logic
        let currentLang = 'en';
        const translations = {
            "Total DO Qty": "कुल DO मात्रा",
            "Lifted Paddy": "उठाया गया धान",
            "Balance to Lift": "उठाने हेतु शेष",
            "Pending DO Details": "लंबित DO विवरण",
            "Active Bank Guarantee": "सक्रिय बैंक गारंटी",
            "Total secured guarantee amount": "कुल सुरक्षित गारंटी राशि",
            "View Details": "विवरण देखें",
            "Upload Security": "सिक्योरिटी अपलोड करें",
            "Free BG Status": "फ्री BG स्थिति",
            "Liability deficit (BG - Paddy Amt)": "देयता कमी (BG - धान राशि)",
            "Gunny Bags Inventory": "बारदाना इन्वेंटरी",
            "Bardana availability at mill premises": "मिल परिसर में बारदाना उपलब्धता",
            "New Bags": "नए बारदाने",
            "Old Bags": "पुराने बारदाने",
            "PDS Bags": "PDS बारदाने",
            "Upcoming BG Expiries": "आगामी BG एक्सपायरी",
            "Tracking Bank Guarantees expiring shortly": "जल्द एक्सपायर होने वाली बैंक गारंटी",
            "Days Left": "दिन शेष",
            "All Bank Guarantees are secure (No expiry in next 90 days).": "सभी बैंक गारंटी सुरक्षित हैं (अगले 90 दिनों में कोई एक्सपायरी नहीं)।",
            "Official Letter Generator": "आधिकारिक पत्र जनरेटर",
            "Generate automated PDFs directly on your company Letterhead.": "सीधे अपने लेटरहेड पर स्वचालित PDF जनरेट करें।",
            "Generate & Download PDF": "PDF जनरेट और डाउनलोड करें",
            "Pending Rice Details": "लंबित चावल विवरण",
            "Agreement No & Type": "अनुबंध क्र. और प्रकार",
            "Rice Quality": "चावल की गुणवत्ता",
            "Remaining Qtls": "शेष क्विंटल",
            "Full Lot Details (Agreement Wise)": "पूर्ण लॉट विवरण (अनुबंध अनुसार)",
            "S.No": "क्र.",
            "GP Date": "GP दिनांक",
            "Approval Date": "स्वीकृति दिनांक",
            "CMR Center": "CMR केंद्र",
            "Lot No": "लॉट क्र.",
            "Quantity": "मात्रा",
            "Commodity": "वस्तु",
            "Bag Year": "बारदाना वर्ष",
            "Status": "स्थिति",
            "Active Bank Guarantees": "सक्रिय बैंक गारंटी",
            "BG No & Bank": "BG क्र. और बैंक",
            "Expiry Date": "एक्सपायरी दिनांक",
            "Amount": "राशि",
            "No Bank Guarantees found.": "कोई बैंक गारंटी नहीं मिली।",
            "Rice Deposit Status (WIP)": "चावल जमा स्थिति (WIP)",
            "Deposited against Total Target (Paddy Lifting)": "कुल लक्ष्य के विरुद्ध जमा (धान उठाव)",
            "Gate Pass Reconciliation": "गेट पास मिलान",
            "Real-time tracking of generated lots against DO mapping": "DO मैपिंग के विरुद्ध जेनरेट किए गए लॉट की रीयल-टाइम ट्रैकिंग",
            "Sync Live Data": "लाइव डेटा सिंक करें",
            "Combined Overview": "संयुक्त अवलोकन"
        };
        const revTranslations = Object.fromEntries(Object.entries(translations).map(([k, v]) => [v, k]));

        function translateNode(node, dict) {
            if (node.nodeType === 3) {
                let text = node.nodeValue.trim();
                if (text && dict[text]) {
                    node.nodeValue = node.nodeValue.replace(text, dict[text]);
                }
            } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
                for (let i = 0; i < node.childNodes.length; i++) {
                    translateNode(node.childNodes[i], dict);
                }
            }
        }

        window.toggleLanguage = function() {
            currentLang = currentLang === 'en' ? 'hi' : 'en';
            
            const btnEn = document.getElementById('langEn');
            const btnHi = document.getElementById('langHi');
            
            if (currentLang === 'en') {
                btnEn.style.background = 'white';
                btnEn.style.color = 'var(--primary)';
                btnHi.style.background = 'transparent';
                btnHi.style.color = 'white';
            } else {
                btnHi.style.background = 'white';
                btnHi.style.color = 'var(--primary)';
                btnEn.style.background = 'transparent';
                btnEn.style.color = 'white';
            }
            
            const dict = currentLang === 'hi' ? translations : revTranslations;
            translateNode(document.body, dict);
        };

        const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
        const formatNumber = (val) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(val);


        const animateValue = (id, start, end, duration, formatter) => {
            const obj = document.getElementById(id);
            if (!obj) return;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 4); 
                const current = start + ease * (end - start);
                obj.innerHTML = formatter(current);
                
                if (id === 'valFreeBG') {
                    if (current < 0) {
                        obj.style.color = "var(--danger)";
                    } else {
                        obj.style.color = "var(--success)";
                    }
                }
                
                if (progress < 1) window.requestAnimationFrame(step);
                else obj.innerHTML = formatter(end);
            };
            window.requestAnimationFrame(step);
        };

        const renderBGs = (bgs) => {
            const list = document.getElementById('bgAlertsList');
            list.innerHTML = '';
            
            bgs.forEach(bg => {
                // Dynamically calculate days left based on today's real time date
                let expiryDate;
                if (bg.date.includes('/')) {
                    const parts = bg.date.split('/');
                    expiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
                } else {
                    expiryDate = new Date(bg.date);
                }
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffTime = expiryDate - today;
                const dynamicDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const finalDaysLeft = dynamicDaysLeft >= 0 ? dynamicDaysLeft : 0;
                
                let statusClass = finalDaysLeft <= 90 ? 'warning' : 'safe';
                if (finalDaysLeft <= 0) statusClass = 'danger'; // Add danger if expired
                
                if (finalDaysLeft > 90) return; // ONLY SHOW <= 90 DAYS LEFT
                
                let iconClass = 'fa-circle-check';
                if (finalDaysLeft <= 90) iconClass = 'fa-triangle-exclamation';
                if (finalDaysLeft <= 0) iconClass = 'fa-circle-xmark';
                
                list.innerHTML += `
                    <div class="alert-item ${statusClass}">
                        <div class="icon-box" style="background: rgba(0,0,0,0.05); color: var(--${statusClass}); width: 40px; height: 40px;"><i class="fa-solid ${iconClass}"></i></div>
                        <div style="flex: 1;">
                            <h4 style="color: var(--text-main); font-size: 1rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                ${formatCurrency(bg.amount)} 
                                <span style="font-size: 0.7rem; background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); color: #475569; padding: 2px 6px; border-radius: 6px; font-weight: 600; letter-spacing: 0.5px;">${bg.id || 'N/A'}</span>
                                ${bg.bank ? `<span style="font-size: 0.7rem; background: #e0e7ff; border: 1px solid #c7d2fe; color: #4f46e5; padding: 2px 6px; border-radius: 6px; font-weight: 700;"><i class="fa-solid fa-building-columns" style="margin-right: 3px;"></i> ${bg.bank}</span>` : ''}
                            </h4>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Expires: <strong style="color: var(--text-main);">${bg.date}</strong></p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-main);">${finalDaysLeft}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Days Left</div>
                        </div>
                    </div>
                `;
            });
            
            if (list.innerHTML === '') {
                list.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--success); font-weight: 600;">
                        <i class="fa-solid fa-shield-check" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                        <p>All Bank Guarantees are secure (No expiry in next 90 days).</p>
                    </div>
                `;
            }
        };

        
        const loadView = (id) => {
            const letterSec = document.getElementById('letterGeneratorSection');
            const btnUploadSecurity = document.getElementById('btnUploadSecurity');
            const mainGrid = document.getElementById('mainDashboardContent');
            const lbSection = document.getElementById('leaderboard-section');
            
            if (id === 'leaderboard') {
                document.getElementById('viewTitle').innerText = 'रायपुर टॉप मिलर्स';
                document.getElementById('viewSubtitle').innerText = 'Agreements aggregated by Miller Code (MA)';
                if (mainGrid) mainGrid.style.display = 'none';
                if (lbSection) lbSection.style.display = 'block';
                if (letterSec) letterSec.style.display = 'none';
                if (btnUploadSecurity) btnUploadSecurity.style.display = 'none';
                return;
            } else {
                if (mainGrid) mainGrid.style.display = 'block';
                if (lbSection) lbSection.style.display = 'none';
            }
            
            const mData = window.dashboardData[id];
            
            // Remove skeletons
            document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));
            
            // Text Updates
            document.getElementById('viewTitle').innerText = id === 'combined' ? 'Combined Overview' : mData.name;
            document.getElementById('viewSubtitle').innerText = id === 'combined' ? 'Aggregated operational and financial metrics' : 'Individual miller performance metrics';
            
            if (id === 'combined') {
                if (letterSec) letterSec.style.display = 'none';
                if (btnUploadSecurity) btnUploadSecurity.style.display = 'none';
            } else {
                if (letterSec) letterSec.style.display = 'flex';
                if (btnUploadSecurity) btnUploadSecurity.style.display = 'inline-block';
            }
            if (id === 'combined') {
                letterSec.style.display = 'none';
                if (btnUploadSecurity) btnUploadSecurity.style.display = 'none';
            } else {
                letterSec.style.display = 'flex';
                if (btnUploadSecurity) btnUploadSecurity.style.display = 'inline-block';
                // Auto-fill template based on nearest BG
                const bg = mData.nearestBgs[0];
                const contentArea = document.getElementById('letterContent');
                if(contentArea.value.includes('[BG Number]')) {
                    contentArea.value = contentArea.value.replace('[BG Number]', bg.id).replace('[Amount]', formatCurrency(bg.amount)).replace('[Date]', bg.date);
                }
            }

            // Progress Bar & Lots Math
            const percent = (mData.depositedRice / mData.targetRice) * 100;
            document.getElementById('progressFill').style.width = `${percent}%`;
            
            const lots = Math.round(mData.riceBalance / 290);
            const depositedLots = Math.round(mData.depositedRice / 290);
            const targetLots = Math.round(mData.targetRice / 290);
            
            // Calculate FCI and NAN Breakdown
            let fciPendingQty = 0;
            let nanPendingQty = 0;
            
            if (mData.riceQualities) {
                mData.riceQualities.forEach(agr => {
                    const typeStr = (agr.agreement_type || "").toUpperCase();
                    if (typeStr.includes("FCI")) {
                        fciPendingQty += agr.total_pending;
                    } else if (typeStr.includes("NAN")) {
                        nanPendingQty += agr.total_pending;
                    } else {
                        // Fallback if neither is explicitly mentioned, though unlikely based on data
                        nanPendingQty += agr.total_pending; 
                    }
                });
            }
            const fciLots = Math.round(fciPendingQty / 290);
            const nanLots = Math.round(nanPendingQty / 290);
            
            // Paddy Math
            const liftedPaddy = mData.totalAllottedPaddy - mData.balancePaddy;
            
            // Animations
            animateValue('valDeposited', 0, mData.depositedRice, 1000, formatNumber);
            animateValue('valTarget', 0, mData.targetRice, 1000, formatNumber);
            animateValue('valPending', 0, mData.riceBalance, 1000, formatNumber);
            animateValue('valPercent', 0, percent, 1000, (v) => v.toFixed(1) + '%');
            animateValue('valPendingLots', 0, lots, 1000, (v) => Math.round(v));
            animateValue('valDepositedLots', 0, depositedLots, 1000, (v) => Math.round(v));
            animateValue('valTargetLots', 0, targetLots, 1000, (v) => Math.round(v));
            
            animateValue('valPendingFCI', 0, fciPendingQty, 1000, formatNumber);
            animateValue('valPendingLotsFCI', 0, fciLots, 1000, (v) => Math.round(v));
            animateValue('valPendingNAN', 0, nanPendingQty, 1000, formatNumber);
            animateValue('valPendingLotsNAN', 0, nanLots, 1000, (v) => Math.round(v));

            animateValue('valTotalDO', 0, mData.totalAllottedPaddy, 1000, formatNumber);
            animateValue('valDODisplay', 0, mData.totalAllottedPaddy, 1000, formatNumber);
            animateValue('valLiftedPaddy', 0, liftedPaddy, 1000, formatNumber);
            animateValue('valBalancePaddy', 0, mData.balancePaddy, 1000, formatNumber);
            
            animateValue('valBG', 0, mData.bgAmount, 1000, formatCurrency);
            animateValue('valFreeBG', 0, mData.freeBg, 1200, formatCurrency);

            renderBGs(mData.nearestBgs);
            
            // Render All BGs Modal
            const allBgsBody = document.getElementById('allBGsModalBody');
            allBgsBody.innerHTML = '';
            if (mData.nearestBgs && mData.nearestBgs.length > 0) {
                mData.nearestBgs.forEach(bg => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">
                            <div style="font-weight: 600; color: #0f172a;">${bg.id || 'N/A'}</div>
                            ${bg.bank ? `<div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;"><i class="fa-solid fa-building-columns"></i> ${bg.bank}</div>` : ''}
                        </td>
                        <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; font-weight: 500; color: #475569;">${bg.date}</td>
                        <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: var(--text-main);">${formatCurrency(bg.amount)}</td>
                    `;
                    allBgsBody.appendChild(tr);
                });
            } else {
                allBgsBody.innerHTML = `<tr><td colspan="3" style="padding: 2rem; text-align: center; color: #64748b;">No Bank Guarantees found.</td></tr>`;
            }
            
            // Render Pending DOs
            const doBody = document.getElementById('doModalBody');
            doBody.innerHTML = '';
            let pendingDOs = mData.pendingDOs || [];
            
            // Build agreement map
            let agrMap = {};
            if (mData.riceQualities) {
                mData.riceQualities.forEach(rq => {
                    agrMap[rq.agreement_no] = rq.agreement_type;
                });
            }
            
            // Aggregate pending DOs
            let aggregatedDOs = {};
            pendingDOs.forEach(pdo => {
                let key = pdo.agreement + '|' + pdo.center + '|' + pdo.date + '|' + pdo.type;
                if (!aggregatedDOs[key]) {
                    let aType = agrMap[pdo.agreement] ? ` <span style="font-size:0.8rem; background:var(--primary); color:white; padding:2px 8px; border-radius:12px; margin-left:8px; font-weight:600;">${agrMap[pdo.agreement]}</span>` : '';
                    aggregatedDOs[key] = {
                        agreement: pdo.agreement,
                        agreementHtml: pdo.agreement + aType,
                        center: pdo.center,
                        date: pdo.date,
                        type: pdo.type,
                        qty: 0
                    };
                }
                aggregatedDOs[key].qty += pdo.qty;
            });
            let finalDOs = Object.values(aggregatedDOs);
            
            if (finalDOs.length > 0) {
                let doTotal = 0;
                
                // Group by agreementHtml
                let agreementGroups = {};
                finalDOs.forEach(pdo => {
                    doTotal += pdo.qty;
                    if (!agreementGroups[pdo.agreementHtml]) {
                        agreementGroups[pdo.agreementHtml] = [];
                    }
                    agreementGroups[pdo.agreementHtml].push(pdo);
                });
                
                Object.keys(agreementGroups).forEach(agr => {
                    // Agreement Header Row
                    doBody.innerHTML += `<tr style="background: rgba(67, 24, 255, 0.04); border-top: 2px solid rgba(67, 24, 255, 0.1);">
                        <td colspan="3" style="padding: 0.8rem 1.2rem; font-weight: 700; color: var(--primary); font-size: 0.95rem;">
                            <i class="fa-solid fa-file-contract" style="margin-right: 0.5rem;"></i> Agreement: ${agr}
                        </td>
                    </tr>`;
                    
                    let subTotal = 0;
                    
                    // DO Rows for this Agreement
                    agreementGroups[agr].forEach(pdo => {
                        subTotal += pdo.qty;
                        let typeColor = pdo.type.includes('Mota') ? '#3b82f6' : (pdo.type.includes('Sarna') ? '#8b5cf6' : '#10b981');
                        let typeBg = pdo.type.includes('Mota') ? '#eff6ff' : (pdo.type.includes('Sarna') ? '#f5f3ff' : '#ecfdf5');
                        
                        doBody.innerHTML += `<tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                            <td style="padding: 1.2rem 1.2rem; border-right: 1px dashed #e2e8f0; padding-left: 2rem;">
                                <div style="font-weight: 700; color: #1e293b; margin-bottom: 0.4rem; font-size: 0.95rem;">${pdo.center}</div>
                                <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;"><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i> ${pdo.date}</div>
                            </td>
                            <td style="padding: 1.2rem 1rem; text-align: center;">
                                <span style="font-size: 0.8rem; font-weight: 700; color: ${typeColor}; background: ${typeBg}; padding: 0.35rem 0.8rem; border-radius: 6px; border: 1px solid ${typeColor}30;">${pdo.type}</span>
                            </td>
                            <td style="padding: 1.2rem 1rem; text-align: right; font-weight: 800; color: #0f172a; font-size: 1.15rem;">
                                ${formatNumber(pdo.qty)} <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Qtls</span>
                            </td>
                        </tr>`;
                    });
                    
                    // Subtotal Row for this Agreement
                    doBody.innerHTML += `<tr style="background: rgba(241, 245, 249, 0.5); border-bottom: 2px solid #e2e8f0;">
                        <td colspan="2" style="padding: 1rem 1.2rem; font-weight: 700; color: #475569; text-align: right; font-size: 0.95rem;">Agreement Total:</td>
                        <td style="padding: 1rem 1rem; font-weight: 800; color: #334155; text-align: right; font-size: 1.15rem;">
                            ${formatNumber(subTotal)} <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Qtls</span>
                        </td>
                    </tr>`;
                });
                
                // Grand Total Row
                doBody.innerHTML += `<tr style="background: rgba(16, 185, 129, 0.08); border-top: 3px solid var(--success);">
                    <td colspan="2" style="padding: 1.5rem 1rem; font-weight: 800; color: #0f172a; text-align: right; font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.5px;">Grand Total:</td>
                    <td style="padding: 1.5rem 1rem; font-weight: 800; color: var(--success); text-align: right; font-size: 1.4rem;">
                        ${formatNumber(doTotal)} <span style="font-size: 1rem; color: #64748b; font-weight: 600;">Qtls</span>
                    </td>
                </tr>`;
            } else {
                doBody.innerHTML = `<tr><td colspan="3" style="padding: 3rem 1rem; text-align: center; color: #94a3b8; font-weight: 500;"><i class="fa-solid fa-check-circle" style="font-size: 2.5rem; color: var(--success); opacity: 0.3; margin-bottom: 0.8rem; display: block;"></i>No pending Delivery Orders at the moment.<br>All issued DOs have been fully lifted.</td></tr>`;
            }

            // Render Gate Pass Table
            const gpTableBody = document.getElementById('gpTableBody');
            let approvedQty = 0;
            let pendingQty = 0;
            
            if (mData.gatePassStatus && mData.gatePassStatus.length > 0) {
                mData.gatePassStatus.forEach(gp => {
                    if (gp.status === "Approved") approvedQty += gp.quantity;
                    else pendingQty += gp.quantity;
                });
                
                const pendingLots = mData.gatePassStatus.filter(gp => gp.status === "Pending");
                
                if (pendingLots.length > 0) {
                    gpTableBody.innerHTML = pendingLots.map(gp => `
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 0.8rem; font-weight: 500;">${gp.date}</td>
                            <td style="padding: 0.8rem; font-weight: 600; color: var(--text-muted);">${gp.agreement || '-'}</td>
                            <td style="padding: 0.8rem; font-weight: 600; color: var(--text-main);">${gp.lotNo}</td>
                            <td style="padding: 0.8rem; text-align: right; font-weight: 600;">${formatNumber(gp.quantity)} Qtls</td>
                            <td style="padding: 0.8rem; text-align: center;">
                                <span style="background: rgba(238, 93, 80, 0.1); color: var(--danger); padding: 0.3rem 0.8rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 700;">
                                    Upload Pending
                                </span>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    gpTableBody.innerHTML = `<tr><td colspan="5" style="padding: 1.5rem; text-align: center; color: var(--success); font-weight: 500;"><i class="fa-solid fa-circle-check"></i> All Paperwork is complete! No pending Gate Passes.</td></tr>`;
                }
                
                window.currentGatePasses = mData.gatePassStatus;
                const agreements = [...new Set(mData.gatePassStatus.map(gp => gp.agreement).filter(Boolean))];
                
                const agreementTabs = document.getElementById('agreementTabs');
                agreementTabs.innerHTML = agreements.map((agr, i) => `
                    <button class="agr-tab-btn" style="padding: 0.5rem 1rem; border-radius: 9999px; border: 1px solid ${i===0 ? 'var(--primary)' : '#e2e8f0'}; background: ${i===0 ? 'rgba(67, 24, 255, 0.1)' : 'white'}; color: ${i===0 ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: 600; cursor: pointer; white-space: nowrap;" onclick="renderModalLots('${agr}', this)">${agr}</button>
                `).join('');
                
                if (agreements.length > 0) {
                    window.renderModalLots(agreements[0], null);
                }
                
            } else {
                gpTableBody.innerHTML = `<tr><td colspan="5" style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-weight: 500;">No Gate Pass data available</td></tr>`;
                document.getElementById('agreementTabs').innerHTML = '';
                document.getElementById('gpModalTableBody').innerHTML = '';
            }

            animateValue('valGpApproved', 0, approvedQty, 1000, formatNumber);
            animateValue('valGpPending', 0, pendingQty, 1000, formatNumber);
            
            // Render Rice Qualities
            const riceBody = document.getElementById('riceModalBody');
            if (mData.riceQualities && mData.riceQualities.length > 0) {
                let html = '';
                let grandTotal = 0;
                
                mData.riceQualities.forEach(agr => {
                    const poolTypes = Object.entries(agr.qualities);
                    if (poolTypes.length === 0) return;
                    
                    grandTotal += agr.total_pending;
                    
                    html += `
                    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s; margin-bottom: 1rem;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='var(--shadow-sm)'; this.style.transform='translateY(0)';">
                        <div style="background: #f8fafc; padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                            <div>
                                <span style="font-size: 0.75rem; font-weight: 600; color: var(--primary); background: rgba(79, 70, 229, 0.1); padding: 0.35rem 0.8rem; border-radius: 20px; border: 1px solid rgba(79, 70, 229, 0.2);"><i class="fa-solid fa-file-contract"></i> ${agr.agreement_type}</span>
                                <div style="font-weight: 700; color: #111827; margin-top: 0.6rem; letter-spacing: 0.5px; font-size: 1.1rem;" data-i18n="${agr.agreement_no}">${agr.agreement_no}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.8rem; color: #6b7280; font-weight: 600; text-transform: uppercase;" data-i18n="Total Pending">Total Pending</div>
                                <div style="font-weight: 700; color: var(--danger); font-size: 1.2rem;">${formatNumber(agr.total_pending)} Qtls</div>
                            </div>
                        </div>
                        <div style="padding: 0;">
                    `;
                    
                    poolTypes.forEach(([pool, qty], idx) => {
                        const qtyLots = (qty / 290).toFixed(2);
                        let poolName = pool;
                        let riceType = '';
                        let riceCategory = '';
                        
                        if (pool.includes('Arwa')) { riceType = 'ARWA'; riceCategory = 'Grade A'; poolName = pool.replace('Arwa', '').trim(); }
                        else if (pool.includes('Usna')) { riceType = 'USNA'; riceCategory = 'Common'; poolName = pool.replace('Usna', '').trim(); }
                        
                        let agencyColor = poolName.includes('FCI') ? '#f59e0b' : 'var(--primary)';
                        
                        html += `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: ${idx < poolTypes.length - 1 ? '1px dashed #e2e8f0' : 'none'}; flex-wrap: wrap; gap: 1rem;">
                                <div style="display: flex; gap: 1rem; align-items: center;">
                                    <div style="width: 4px; height: 35px; background: ${agencyColor}; border-radius: 4px;"></div>
                                    <div>
                                        <div style="font-weight: 700; color: #374151; font-size: 0.95rem;">${poolName}</div>
                                        <div style="font-size: 0.8rem; color: #6b7280; margin-top: 0.2rem;">
                                            ${riceType ? `<span style="font-weight: 600; color: #111827;">${riceType}</span> • ` : ''} ${riceCategory || pool}
                                        </div>
                                    </div>
                                </div>
                                <div style="text-align: right; background: #f9fafb; padding: 0.6rem 1rem; border-radius: 12px; border: 1px solid #f3f4f6;">
                                    <div style="font-weight: 700; color: #111827; font-size: 1.1rem;">${formatNumber(qty)}</div>
                                    <div style="font-size: 0.75rem; color: #6b7280; font-weight: 600; margin-top: 2px;">~${qtyLots} LOTS</div>
                                </div>
                            </div>
                        `;
                    });
                    
                    html += `</div></div>`;
                });
                
                // Add Grand Total
                html += `
                    <div style="background: linear-gradient(135deg, var(--primary), #818cf8); border-radius: 16px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; color: white; box-shadow: var(--shadow-md); margin-top: 1rem;">
                        <div>
                            <div style="font-size: 0.9rem; font-weight: 600; opacity: 0.9;" data-i18n="Total Outstanding Balance">Total Outstanding Balance</div>
                            <div style="font-size: 1.5rem; font-weight: 700; margin-top: 0.2rem;">${formatNumber(grandTotal)} Qtls</div>
                        </div>
                        <i class="fa-solid fa-boxes-stacked" style="font-size: 2.5rem; opacity: 0.5;"></i>
                    </div>
                `;
                
                riceBody.innerHTML = html;
            } else {
                riceBody.innerHTML = `<div style="text-align: center; padding: 3rem; color: #6b7280;"><i class="fa-solid fa-check-circle" style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;"></i><h3 data-i18n="All Clear">All Clear</h3><p data-i18n="No pending rice found for this mill.">No pending rice found for this mill.</p></div>`;
            }
        };

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                const target = e.target.closest('.tab-btn');
                target.classList.add('active');
                loadView(target.dataset.id);
            });
        });

        // Letterhead LocalStorage Logic
        const uploadInput = document.getElementById('letterheadUpload');
        const statusText = document.getElementById('letterheadStatus');
        const previewDiv = document.getElementById('letterPreview');
        
        // Load existing
        const savedLetterhead = localStorage.getItem('userLetterhead');
        if (savedLetterhead) {
            previewDiv.style.backgroundImage = `url(${savedLetterhead})`;
            statusText.style.display = 'block';
        }

        uploadInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    localStorage.setItem('userLetterhead', dataUrl);
                    previewDiv.style.backgroundImage = `url(${dataUrl})`;
                    statusText.style.display = 'block';
                    statusText.innerHTML = '<i class="fa-solid fa-check"></i> New Letterhead Saved Successfully!';
                };
                reader.readAsDataURL(file);
            }
        });

        // Generate PDF
        document.getElementById('generatePdfBtn').addEventListener('click', function() {
            if (!localStorage.getItem('userLetterhead')) {
                alert("Please upload your letterhead image first.");
                return;
            }
            
            const content = document.getElementById('letterContent').value;
            document.getElementById('renderText').innerText = content;
            
            const element = document.getElementById('letterPreview');
            element.style.top = '0'; // Bring to viewport briefly for render
            
            const opt = {
                margin:       0,
                filename:     'Official_Letter.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'px', format: [800, 1131], orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                element.style.top = '-9999px'; // Hide again
            });
        });
        
        // Subject Template Change
        document.getElementById('letterSubject').addEventListener('change', function(e) {
            const val = e.target.value;
            const contentArea = document.getElementById('letterContent');
            
            if (val === 'do_extension') {
                contentArea.value = `To,\nThe District Marketing Officer (DMO),\n[District Name]\n\nSubject: Request for Extension of DO Validity\n\nDear Sir/Madam,\n\nWe humbly request an extension for the Delivery Order No. [DO Number] as we are facing transportation delays due to unavoidable circumstances.\n\nThanking you,\n\nAuthorized Signatory`;
            } else if (val === 'bg_renewal') {
                contentArea.value = `To,\nThe District Marketing Officer (DMO),\n[District Name]\n\nSubject: Request for Renewal of Bank Guarantee\n\nDear Sir/Madam,\n\nPlease find enclosed the request to renew the Bank Guarantee No. [BG Number] amounting to Rs. [Amount] which is expiring on [Date]. We request you to kindly process the renewal for a further period of 12 months.\n\nThanking you,\n\nAuthorized Signatory`;
            } else {
                contentArea.value = `To,\nThe District Marketing Officer (DMO),\n[District Name]\n\nSubject: \n\nDear Sir/Madam,\n\n\nThanking you,\n\nAuthorized Signatory`;
            }
        });

        window.renderModalLots = function(agr, btn) {
            if (btn) {
                document.querySelectorAll('.agr-tab-btn').forEach(b => {
                    b.style.background = 'white';
                    b.style.color = 'var(--text-muted)';
                    b.style.borderColor = '#e2e8f0';
                });
                btn.style.background = 'rgba(67, 24, 255, 0.1)';
                btn.style.color = 'var(--primary)';
                btn.style.borderColor = 'var(--primary)';
            }
            
            const tbody = document.getElementById('gpModalTableBody');
            const lots = window.currentGatePasses.filter(gp => gp.agreement === agr);
            
            tbody.innerHTML = lots.map((gp, i) => {
                const isApp = gp.status === "Approved";
                return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 1rem 0.8rem; font-weight: 500;">${i+1}</td>
                        <td style="padding: 1rem 0.8rem; font-weight: 500;">${gp.date}</td>
                        <td style="padding: 1rem 0.8rem; font-weight: 500;">${gp.approvalDate || '-'}</td>
                        <td style="padding: 1rem 0.8rem; font-weight: 500; color: var(--text-muted);">${gp.cmrCenter || '-'}</td>
                        <td style="padding: 1rem 0.8rem; font-weight: 700; color: var(--text-main);">${gp.lotNo}</td>
                        <td style="padding: 1rem 0.8rem; text-align: right; font-weight: 600;">${formatNumber(gp.quantity)} Qtls</td>
                        <td style="padding: 1rem 0.8rem; font-weight: 500;">${gp.commodity || '-'}</td>
                        <td style="padding: 1rem 0.8rem; font-weight: 500;">${gp.bagYear || '-'}</td>
                        <td style="padding: 1rem 0.8rem; text-align: center;">
                            <span style="background: ${isApp ? 'rgba(5, 205, 153, 0.1)' : 'rgba(238, 93, 80, 0.1)'}; color: ${isApp ? 'var(--success)' : 'var(--danger)'}; padding: 0.3rem 0.8rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">
                                ${gp.status}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        };

        function generateCombinedData() {
            const dashboardData = window.dashboardData || {};
            const keys = Object.keys(dashboardData).filter(k => k !== 'combined' && k !== 'leaderboard');
            if (keys.length <= 1) return;
            
            let combined = {
                name: "Combined Operations Overview",
                targetRice: 0,
                depositedRice: 0,
                riceBalance: 0,
                totalAllottedPaddy: 0,
                balancePaddy: 0,
                paddyAmt: 0,
                bgAmount: 0,
                freeBg: 0,
                riceQualities: [],
                pendingDOs: [],
                gatePassStatus: [],
                nearestBgs: []
            };

            let qualityMap = {};

            keys.forEach(k => {
                const md = dashboardData[k];
                combined.targetRice += (md.targetRice || 0);
                combined.depositedRice += (md.depositedRice || 0);
                combined.riceBalance += (md.riceBalance || 0);
                combined.totalAllottedPaddy += (md.totalAllottedPaddy || 0);
                combined.balancePaddy += (md.balancePaddy || 0);
                combined.paddyAmt += (md.paddyAmt || 0);
                combined.bgAmount += (md.bgAmount || 0);
                combined.freeBg += (md.freeBg || 0);
                
                // Merge arrays
                if (md.pendingDOs) combined.pendingDOs = combined.pendingDOs.concat(md.pendingDOs);
                if (md.gatePassStatus) combined.gatePassStatus = combined.gatePassStatus.concat(md.gatePassStatus);
                if (md.nearestBgs) combined.nearestBgs = combined.nearestBgs.concat(md.nearestBgs);
                
                // Merge qualities
                if (md.riceQualities) {
                    md.riceQualities.forEach(rq => {
                        if (rq.qualities) {
                            Object.entries(rq.qualities).forEach(([qName, qQty]) => {
                                if (!qualityMap[qName]) qualityMap[qName] = 0;
                                qualityMap[qName] += qQty;
                            });
                        }
                    });
                }
            });

            if (Object.keys(qualityMap).length > 0) {
                combined.riceQualities = [{ qualities: qualityMap }];
            }
            
            // Sort merged arrays
            combined.nearestBgs.sort((a, b) => (a.daysLeft || Infinity) - (b.daysLeft || Infinity));
            
            window.dashboardData['combined'] = combined;
        }

        // Initialize the first view
        function initializeDashboardView() {
            const dashboardData = window.dashboardData || {};
            const rawKeys = Object.keys(dashboardData).filter(k => k !== 'leaderboard' && k !== 'combined');
            
            if (rawKeys.length > 1) {
                generateCombinedData();
            }
            
            const tabsContainer = document.getElementById('millerTabs');
            const keys = Object.keys(window.dashboardData).filter(k => k !== 'leaderboard');
            
            // Generate Tabs
            if (keys.includes('combined')) {
                tabsContainer.innerHTML += `<button class="tab-btn" data-id="combined">Combined Overview</button>`;
            }
            
            // Add Leaderboard Tab Button
            tabsContainer.innerHTML += `<button class="tab-btn" data-id="leaderboard" style="background: linear-gradient(135deg, #FFD700, #FDB931); color: #000; font-weight: bold;"><i class="fa-solid fa-trophy"></i> टॉप मिलर्स</button>`;
            
            keys.forEach(k => {
                if (k !== 'combined') {
                    // Make sure name exists, use ID as fallback
                    const millerName = dashboardData[k].miller_name_full || k;
                    tabsContainer.innerHTML += `<button class="tab-btn" data-id="${k}">${millerName}</button>`;
                }
            });
            
            // Add event listeners to tabs
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    loadView(e.target.getAttribute('data-id'));
                });
            });

            // Activate first tab
            let firstId;
            if (keys.length > 1) {
                firstId = 'combined';
            } else {
                firstId = keys[0];
            }
            
            // Set initial active class
            const initialTab = document.querySelector(`.tab-btn[data-id="${firstId}"]`);
            if (initialTab) initialTab.classList.add('active');

            if (firstId) loadView(firstId);
            
            // Add 'Upload Security' button to Active Bank Guarantee card
            const bgCard = document.querySelector('.bg-card-container');
            if (bgCard) {
                const btn = document.createElement('button');
                btn.id = 'uploadSecurityBtn';
                btn.className = 'btn';
                btn.style.cssText = 'background: var(--primary); color: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; font-size: 0.85rem;';
                btn.innerHTML = '<i class="fa-solid fa-plus"></i> Upload Security';
                btn.onclick = () => document.getElementById('uploadSecurityModal').style.display = 'flex';
                bgCard.appendChild(btn);
            }
        }
        // renderLeaderboard
        function renderLeaderboard() {
            if (!window.leaderboardData) return;
            const tbody = document.getElementById('leaderboardTableBody');
            tbody.innerHTML = '';
            
            window.leaderboardData.forEach(miller => {
                const tr = document.createElement('tr');
                
                let rankHtml = `<strong>#${miller.rank}</strong>`;
                if (miller.rank === 1) rankHtml = `<span style="background: #FFD700; color: #000; padding: 0.2rem 0.6rem; border-radius: 50px; font-weight: bold;"><i class="fa-solid fa-crown"></i> 1</span>`;
                else if (miller.rank === 2) rankHtml = `<span style="background: #C0C0C0; color: #000; padding: 0.2rem 0.6rem; border-radius: 50px; font-weight: bold;">2</span>`;
                else if (miller.rank === 3) rankHtml = `<span style="background: #CD7F32; color: #fff; padding: 0.2rem 0.6rem; border-radius: 50px; font-weight: bold;">3</span>`;

                let rawPct = miller.percentage;
                let pct = rawPct > 100 ? 100 : rawPct;
                
                let color = 'var(--primary)';
                if (pct < 50) color = 'var(--danger)';
                else if (pct < 80) color = 'var(--warning)';
                else if (pct >= 100) color = 'var(--success)';
                
                let rem = (miller.target_rice - miller.deposited_rice);
                if (rem < 0) rem = 0;
                
                tr.innerHTML = `
                    <td style="padding: 1rem; text-align: center; border-bottom: 1px solid var(--border-light);">${rankHtml}</td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-light);">
                        <div style="font-weight: 600; color: var(--text-main);">${miller.miller_name}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); background: #f1f5f9; display: inline-block; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">
                            <strong>${miller.miller_id}</strong>
                        </div>
                    </td>
                    <td style="padding: 1rem; text-align: right; border-bottom: 1px solid var(--border-light);">
                        <div style="font-weight: 500;">${miller.total_paddy.toFixed(0)} Qtl</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Target: ${miller.target_rice.toFixed(0)}</div>
                    </td>
                    <td style="padding: 1rem; text-align: right; border-bottom: 1px solid var(--border-light);">
                        <div style="font-weight: 500; color: var(--primary);">${miller.deposited_rice.toFixed(0)} Qtl</div>
                        <div style="font-size: 0.75rem; color: var(--danger);">Rem: ${rem.toFixed(0)}</div>
                    </td>
                    <td style="padding: 1rem; border-bottom: 1px solid var(--border-light);">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="font-weight: bold; color: ${color}; width: 55px;">${rawPct.toFixed(1)}%</div>
                            <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: ${pct}%; background: ${color}; border-radius: 4px;"></div>
                            </div>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
        
        setTimeout(renderLeaderboard, 500);
        
        // filterLeaderboard
        function filterLeaderboard() {
            const input = document.getElementById('millerSearch').value.toLowerCase();
            const tbody = document.getElementById('leaderboardTableBody');
            if (!tbody) return;
            const trs = tbody.getElementsByTagName('tr');
            
            for (let i = 0; i < trs.length; i++) {
                const text = trs[i].innerText.toLowerCase();
                if (text.includes(input)) {
                    trs[i].style.display = '';
                } else {
                    trs[i].style.display = 'none';
                }
            }
        }
        
        // --- AUTHENTICATION & SECURITY LOGIC ---
        
        const API_BASE_URL = 'https://cmrs-pro-dashboard.onrender.com/api';

        async function fetchDashboardData(millerId) {
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/${millerId}`);
                if (!response.ok) throw new Error('Data not found');
                const result = await response.json();
                
                if (!window.dashboardData) window.dashboardData = {};
                window.dashboardData[millerId] = result.data;
                return true;
            } catch (error) {
                console.error("Error fetching data:", error);
                return false;
            }
        }

        function getCmrsUsers() {
            const raw = localStorage.getItem('cmrs_user') || sessionStorage.getItem('cmrs_user');
            if (!raw) return [];
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : [raw];
            } catch(e) {
                return [raw];
            }
        }

        function checkLoginStatus() {
            const users = getCmrsUsers();
            const loginOverlay = document.getElementById('loginOverlay');
            const paymentOverlay = document.getElementById('paymentOverlay');
            const loadingOverlay = document.getElementById('globalLoadingOverlay');
            
            if (loadingOverlay) loadingOverlay.style.display = 'none';

            // Check if at least one user has loaded data
            const hasData = users.some(u => window.dashboardData && window.dashboardData[u]);

            if (users.length > 0 && hasData) {
                if (sessionStorage.getItem('payment_skipped')) {
                    if(loginOverlay) loginOverlay.style.display = 'none';
                    if(paymentOverlay) paymentOverlay.style.display = 'none';
                    return true;
                } else {
                    if(loginOverlay) loginOverlay.style.display = 'none';
                    if(paymentOverlay) paymentOverlay.style.display = 'flex';
                    return false;
                }
            } else {
                if(loginOverlay) loginOverlay.style.display = 'flex';
                if(paymentOverlay) paymentOverlay.style.display = 'none';
                return false;
            }
        }

        async function initAuth() {
            // Force clear any old data.js cache to prevent ghost millers
            window.dashboardData = {};
            
            const users = getCmrsUsers();
            if (users.length > 0) {
                let anySuccess = false;
                for (const u of users) {
                    const success = await fetchDashboardData(u);
                    if (success) anySuccess = true;
                }
                
                if (anySuccess) {
                    if (checkLoginStatus()) {
                        initializeDashboardView();
                    }
                } else {
                    // If no data is available yet, DO NOT log out. 
                    // This means they just registered and GitHub Actions is scraping data!
                    const loadingOverlay = document.getElementById('globalLoadingOverlay');
                    const title = document.getElementById('loadingOverlayTitle');
                    const desc = document.getElementById('loadingOverlayDesc');
                    
                    if (loadingOverlay && title && desc) {
                        loadingOverlay.style.display = 'flex';
                        title.innerText = "Extracting Live Data";
                        desc.innerText = "Please wait while our bot fetches your data from the Markfed portal... This takes about 1-2 minutes.";
                        
                        // Auto-refresh the page every 15 seconds to check if data is ready
                        setTimeout(() => {
                            window.location.reload();
                        }, 15000);
                    }
                }
            } else {
                checkLoginStatus();
            }
        }

        function skipPayment() {
            sessionStorage.setItem('payment_skipped', 'true');
            window.location.reload();
        }

        async function handleLogin(event) {
            event.preventDefault();
            const usernameInput = document.getElementById('loginUsername').value.trim().toUpperCase();
            const passwordInput = document.getElementById('loginPassword').value.trim();
            const keepLoggedIn = document.getElementById('keepLoggedIn').checked;
            const errorMsg = document.getElementById('loginError');
            const submitBtn = event.target.querySelector('button[type="submit"]');

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: usernameInput, password: passwordInput })
                });

                const result = await response.json();

                if (response.ok) {
                    const users = getCmrsUsers();
                    if (!users.includes(usernameInput)) users.push(usernameInput);

                    if (keepLoggedIn) {
                        localStorage.setItem('cmrs_user', JSON.stringify(users));
                    } else {
                        sessionStorage.setItem('cmrs_user', JSON.stringify(users));
                    }
                    
                    if (result.status === 'processing') {
                        alert(result.message);
                    }
                    
                    window.location.reload();
                } else {
                    errorMsg.style.display = 'block';
                    errorMsg.textContent = result.detail || "Invalid Miller ID or Password.";
                    submitBtn.innerHTML = 'Sign In <i class="fa-solid fa-arrow-right"></i>';
                    submitBtn.disabled = false;
                }
            } catch (err) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = "Server connection error. Please try again later.";
                submitBtn.innerHTML = 'Sign In <i class="fa-solid fa-arrow-right"></i>';
                submitBtn.disabled = false;
            }
        }

        function logoutUser() {
            localStorage.removeItem('cmrs_user');
            sessionStorage.removeItem('cmrs_user');
            sessionStorage.removeItem('payment_skipped');
            window.location.reload();
        }

        // Add Mill logic
        async function handleAddMill(event) {
            event.preventDefault();
            const millerId = document.getElementById('newMillId').value.trim().toUpperCase();
            const password = document.getElementById('newMillPassword').value.trim();
            const submitBtn = event.target.querySelector('button[type="submit"]');
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE_URL}/add-mill`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ miller_id: millerId, password: password })
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert(result.message + "\n\nPlease wait 1-2 minutes and refresh the page.");
                    document.getElementById('addMillModal').style.display = 'none';
                    event.target.reset();
                    
                    const users = getCmrsUsers();
                    if (!users.includes(millerId)) {
                        users.push(millerId);
                        if (localStorage.getItem('cmrs_user')) {
                            localStorage.setItem('cmrs_user', JSON.stringify(users));
                        } else if (sessionStorage.getItem('cmrs_user')) {
                            sessionStorage.setItem('cmrs_user', JSON.stringify(users));
                        } else {
                            localStorage.setItem('cmrs_user', JSON.stringify(users));
                        }
                    }
                } else {
                    alert("Error: " + result.detail);
                }
            } catch (err) {
                alert("Server connection error. Please try again.");
            } finally {
                submitBtn.innerHTML = '<i class="fa-solid fa-link"></i> Connect Mill';
                submitBtn.disabled = false;
            }
        }

        // Sync Live Data logic
        async function handleSyncLive(event) {
            // Get current active miller ID
            let activeMillerId = null;
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                activeMillerId = activeTab.getAttribute('data-id');
            }
            
            if (!activeMillerId || activeMillerId === 'combined' || activeMillerId === 'leaderboard') {
                alert("Please select a specific Mill from the tabs above to sync live data.");
                return;
            }

            const btn = document.getElementById('syncButton');
            const btnText = document.getElementById('syncBtnText');
            const icon = btn.querySelector('i');
            
            btn.disabled = true;
            btnText.innerText = "Syncing...";
            icon.classList.add('fa-spin');
            
            try {
                const response = await fetch(`${API_BASE_URL}/sync-live`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ miller_id: activeMillerId })
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert(result.message);
                    // Freeze button
                    btnText.innerText = "Cooldown Active";
                    btn.style.background = "#e2e8f0";
                    btn.style.color = "#94a3b8";
                    btn.style.cursor = "not-allowed";
                    icon.classList.remove('fa-spin');
                    icon.classList.remove('fa-arrows-rotate');
                    icon.classList.add('fa-lock');
                } else {
                    alert("Error: " + result.detail);
                    btn.disabled = false;
                    btnText.innerText = "Sync Live Data";
                    icon.classList.remove('fa-spin');
                }
            } catch (err) {
                alert("Server connection error.");
                btn.disabled = false;
                btnText.innerText = "Sync Live Data";
                icon.classList.remove('fa-spin');
            }
        }

        // Add Logout button dynamically to navbar if logged in
        document.addEventListener('DOMContentLoaded', () => {
            const loggedInUser = localStorage.getItem('cmrs_user') || sessionStorage.getItem('cmrs_user');
            if (loggedInUser) {
                const navControls = document.querySelector('.navbar > div:last-child');
                if (navControls) {
                    const logoutBtn = document.createElement('button');
                    logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
                    logoutBtn.className = 'btn';
                    logoutBtn.style.cssText = 'background: rgba(238, 93, 80, 0.1); color: var(--danger); border: none; padding: 0.6rem 1.2rem; border-radius: 10px; cursor: pointer; font-weight: 700; margin-left: 0.5rem; transition: background 0.3s;';
                    logoutBtn.onmouseover = () => logoutBtn.style.background = 'rgba(238, 93, 80, 0.2)';
                    logoutBtn.onmouseout = () => logoutBtn.style.background = 'rgba(238, 93, 80, 0.1)';
                    logoutBtn.onclick = logoutUser;
                    navControls.appendChild(logoutBtn);
                }
            }
        });

        // --- POLICY & LEGAL PAGES LOGIC ---
        
        const policies = {
            privacy: {
                title: "Privacy Policy",
                content: `
                    <h4>1. Data Collection</h4>
                    <p>We collect your Miller ID, operational metrics, and portal access tokens strictly for the purpose of generating your financial dashboard.</p>
                    <h4>2. Data Security</h4>
                    <p>All extracted portal data is stored securely. We do not share your bank guarantee or delivery order details with any third parties.</p>
                    <h4>3. Cookies and Storage</h4>
                    <p>We use local browser storage to keep you logged in permanently if you choose the option. No tracking cookies are used.</p>
                `
            },
            terms: {
                title: "Terms & Conditions",
                content: `
                    <h4>1. Usage Terms</h4>
                    <p>This software is provided "as is" to assist Custom Milling rice millers in Chhattisgarh. It is an independent dashboard and is not an official Markfed or State Government portal.</p>
                    <h4>2. Account Responsibility</h4>
                    <p>You are responsible for maintaining the confidentiality of your login credentials. Any portal automation performed on your behalf is done with your explicit consent.</p>
                    <h4>3. Liability</h4>
                    <p>While we strive for 100% accuracy in financial calculations (Free BG, DO balances), users must verify data against the official portal before making critical business decisions.</p>
                `
            },
            refund: {
                title: "Refund Policy",
                content: `
                    <h4>1. Subscription Services</h4>
                    <p>CMRS PRO is offered on a subscription basis. If you are not satisfied with the dashboard, you may cancel at any time.</p>
                    <h4>2. Refund Eligibility</h4>
                    <p>Refunds are processed on a pro-rata basis if requested within the first 7 days of the billing cycle. No refunds are provided for past completed months.</p>
                `
            }
        };

        function openPolicyModal(type) {
            const modal = document.getElementById('policyModal');
            const title = document.getElementById('policyModalTitle');
            const content = document.getElementById('policyModalContent');
            
            if (policies[type]) {
                title.innerText = policies[type].title;
                content.innerHTML = policies[type].content;
                modal.style.display = 'flex';
            }
        }



// --- Dark Mode ---
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const icon = document.querySelector('#darkModeBtn i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialization on Load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
    
    // Initialize Authentication
    initAuth();
});
