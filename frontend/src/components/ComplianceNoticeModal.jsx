import React, { useState, useEffect } from 'react';
import { FiShield, FiAlertCircle, FiX, FiExternalLink, FiCheck, FiInfo } from 'react-icons/fi';
import '../styles/ComplianceNoticeModal.css';

const ComplianceNoticeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    // Check if operator already dismissed the top banner in this session
    const dismissed = sessionStorage.getItem('pm_statutory_banner_dismissed');
    if (dismissed === 'true') {
      setBannerVisible(false);
    }

    // Check if user has seen initial modal ever
    const seenModal = localStorage.getItem('pm_compliance_modal_seen');
    if (!seenModal) {
      // Auto open modal on first entry after brief delay so user sees it clearly
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('pm_compliance_modal_seen', 'true');
      }, 900);
      return () => clearTimeout(timer);
    }

    // Global event listener to open modal from anywhere (Navbar, Footer, etc.)
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('pagematch:open-compliance-modal', handleOpen);
    return () => window.removeEventListener('pagematch:open-compliance-modal', handleOpen);
  }, []);

  const dismissBanner = () => {
    setBannerVisible(false);
    sessionStorage.setItem('pm_statutory_banner_dismissed', 'true');
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Architectural System Banner */}
      {bannerVisible && (
        <aside className="pm-compliance-banner" aria-label="System Legal & Research Disclosure">
          <div className="pm-compliance-banner__inner font-mono">
            <div className="pm-compliance-banner__lead">
              <span className="compliance-pulse-dot"></span>
              <span className="compliance-tag">[RESEARCH DISCLOSURE]</span>
              <span className="compliance-text">
                Experimental recommendation engine developed from scratch by Saketh Chokkapu. In compliance with the <strong>Indian Copyright Act, 1957 (Section 52 &mdash; Fair Dealing)</strong>, full book contents are not hosted or displayed.
              </span>
            </div>
            <div className="pm-compliance-banner__actions">
              <button
                className="compliance-btn compliance-btn--details"
                onClick={() => setIsOpen(true)}
              >
                <span>[ STATUTE &amp; FAIR USE ]</span>
              </button>
              <button
                className="compliance-btn compliance-btn--dismiss"
                onClick={dismissBanner}
                title="Dismiss Notice"
              >
                <FiX size={12} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Comprehensive Architectural Modal */}
      {isOpen && (
        <div className="pm-compliance-backdrop" onClick={closeModal}>
          <div
            className="pm-compliance-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="compliance-title"
          >
            {/* Dialog Terminal Header */}
            <header className="pm-compliance-dialog__header font-mono">
              <div className="pm-compliance-dialog__meta">
                <span className="meta-icon"><FiShield size={14} /></span>
                <span className="meta-title" id="compliance-title">
                  SYS_DISPATCH // STATUTORY LEGAL &amp; ARCHITECTURAL DISCLOSURE
                </span>
              </div>
              <button
                className="pm-compliance-dialog__close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <FiX size={16} />
              </button>
            </header>

            {/* Dialog Content */}
            <div className="pm-compliance-dialog__body">
              {/* Alert Callout */}
              <div className="pm-compliance-callout">
                <div className="callout-icon">
                  <FiAlertCircle size={18} />
                </div>
                <div className="callout-text">
                  <h4 className="font-mono callout-heading">
                    EXPERIMENTAL RECOMMENDATION ENGINE &middot; ZERO FULL-TEXT STORAGE
                  </h4>
                  <p>
                    PageMatch is an independent experimental algorithmic discovery system developed from scratch to advance latent-space neural matching and cosine vector retrieval. To respect author and publisher rights, <strong>no full copyrighted literary texts, manuscripts, or e-books are stored, displayed, or distributed</strong>.
                  </p>
                </div>
              </div>

              {/* 3-Section Grid Breakdown */}
              <div className="pm-compliance-grid font-mono">
                {/* 01: The Model Architecture */}
                <div className="pm-compliance-col">
                  <div className="col-header">
                    <span className="col-num">01 //</span>
                    <span className="col-title">ENGINE ARCHITECTURE</span>
                  </div>
                  <p className="col-desc">
                    Engineered from scratch by <strong>Saketh Chokkapu</strong> utilizing Hugging Face model <code>cs22/book-engine</code>. Computes pairwise cosine similarity matrices and TF-IDF vector projections across 6,511 indexed volumes without parsing verbatim texts.
                  </p>
                  <ul className="col-list">
                    <li>&bull; Latent Dimensionality: 64</li>
                    <li>&bull; TF-IDF Feature Space: 31,017 tokens</li>
                    <li>&bull; Purely mathematical vector mapping</li>
                  </ul>
                </div>

                {/* 02: Indian Copyright Law */}
                <div className="pm-compliance-col">
                  <div className="col-header">
                    <span className="col-num">02 //</span>
                    <span className="col-title">INDIAN COPYRIGHT LAW</span>
                  </div>
                  <p className="col-desc">
                    Strictly operates under the statutory provisions of the <strong>Indian Copyright Act, 1957</strong>:
                  </p>
                  <div className="col-highlight">
                    <strong>Section 52(1)(a)(i) &amp; (ii):</strong>
                    <em>&ldquo;The following acts shall not constitute an infringement of copyright, namely: a fair dealing with any work for the purpose of private or personal use, including research, or for criticism or review of that work...&rdquo;</em>
                  </div>
                  <p className="col-desc" style={{ marginTop: '8px' }}>
                    All book metadata, covers, and short synopses are indexed strictly under academic fair dealing and transformative information retrieval standards.
                  </p>
                </div>

                {/* 03: Content Boundaries & Redirection */}
                <div className="pm-compliance-col">
                  <div className="col-header">
                    <span className="col-num">03 //</span>
                    <span className="col-title">INTELLECTUAL PROPERTY</span>
                  </div>
                  <p className="col-desc">
                    PageMatch functions strictly as an <strong>indexing and discovery compass</strong>. We encourage users to support original authors by purchasing copies or utilizing public lending libraries:
                  </p>
                  <ul className="col-list">
                    <li>&bull; Zero piracy or full e-book downloads</li>
                    <li>&bull; Bibliographic metadata attribution</li>
                    <li>&bull; Direct links to official publishers &amp; stores</li>
                  </ul>
                </div>
              </div>

              {/* Developer & Legal Sign-off */}
              <div className="pm-compliance-signoff font-mono">
                <div className="signoff-left">
                  <span className="signoff-label">OPERATOR &amp; DEVELOPER:</span>
                  <span className="signoff-val">Saketh Chokkapu</span>
                  <span className="signoff-sep">/</span>
                  <span className="signoff-label">JURISDICTION:</span>
                  <span className="signoff-val">India (IN)</span>
                  <span className="signoff-sep">/</span>
                  <span className="signoff-label">STATUS:</span>
                  <span className="signoff-val text-accent">VERIFIED 100% COMPLIANT</span>
                </div>
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <footer className="pm-compliance-dialog__footer font-mono">
              <div className="footer-left">
                <span className="text-muted">INDIAN COPYRIGHT ACT, 1957 &middot; SEC 52(1)(a)</span>
              </div>
              <div className="footer-right">
                <button
                  className="compliance-action-btn compliance-action-btn--primary"
                  onClick={closeModal}
                >
                  <FiCheck size={14} />
                  <span>[ ACKNOWLEDGE &amp; ENTER SYSTEM ]</span>
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default ComplianceNoticeModal;
