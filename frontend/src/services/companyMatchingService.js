/**
 * Company Matching Service
 * Handles AI-powered matching between candidates and companies
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class CompanyMatchingService {
  /**
   * Match candidate with companies based on profile and interview
   */
  async matchCandidates(candidateProfile, interviewTranscript = null, interviewAnalysis = null) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/companies/match-candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_profile: candidateProfile,
          interview_transcript: interviewTranscript,
          interview_analysis: interviewAnalysis
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error matching candidates:', error);
      throw error;
    }
  }

  /**
   * Get all companies in database
   */
  async getCompanies() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/companies/companies`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  /**
   * Get specific company details
   */
  async getCompany(companyId) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/companies/companies/${companyId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  /**
   * Apply candidate to specific company position
   */
  async applyToCompany(candidateId, companyId, positionId) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/companies/apply-to-company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_id: candidateId,
          company_id: companyId,
          position_id: positionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error applying to company:', error);
      throw error;
    }
  }

  /**
   * Get all matches for a specific candidate
   */
  async getCandidateMatches(candidateId) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/companies/candidate-matches/${candidateId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching candidate matches:', error);
      throw error;
    }
  }

  /**
   * Apply to all matching companies automatically
   */
  async applyToAllMatches(matches, candidateId) {
    const applications = [];
    
    for (const match of matches) {
      try {
        const application = await this.applyToCompany(
          candidateId,
          match.company_id,
          match.position_id
        );
        applications.push({
          ...application,
          company_name: match.company_name,
          position_title: match.position_title,
          match_score: match.match_score
        });
      } catch (error) {
        console.error(`Failed to apply to ${match.company_name}:`, error);
        applications.push({
          error: true,
          company_name: match.company_name,
          position_title: match.position_title,
          error_message: error.message
        });
      }
    }
    
    return applications;
  }
}

export const companyMatchingService = new CompanyMatchingService();
