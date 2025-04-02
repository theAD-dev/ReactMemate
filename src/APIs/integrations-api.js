import { fetchAPI } from "./base-api";
const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getStripeIntegrations = async () => {
    const endpoint = `/settings/integrations/stripe/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const stripeIntegrationsSet = async (data) => {
    const endpoint = '/settings/integrations/stripe/';
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const stripeIntegrationsDelete = async (data) => {
    const endpoint = '/settings/integrations/stripe/disconnect/';
    const options = {
        method: 'DELETE',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getGoogleReviewIntegrations = async () => {
    const endpoint = `/settings/integrations/google/review/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const googleReviewIntegrationsSet = async (data) => {
    const endpoint = '/settings/integrations/google/review/';
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getTwilioIntegrations = async () => {
    const endpoint = `/settings/integrations/twilio/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const twilioIntegrationsSet = async (data) => {
    const endpoint = '/settings/integrations/twilio/';
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getEmailIntegrations = async () => {
    const endpoint = `/references/outgoing-email/`;
    const options = {
        method: 'GET',
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const emailIntegrationsSet = async (data) => {
    const endpoint = '/references/outgoing-email/';
    const options = {
        method: 'PUT',
        body: data
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const getXeroIntegrations = async () => {
    const endpoint = '/xero/status/';
    const options = {
        method: 'GET'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};

export const disconnectXeroIntegrations = async () => {
    const endpoint = '/xero/disconnect/';
    const options = {
        method: 'POST'
    };
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    return fetchAPI(url.toString(), options);
};