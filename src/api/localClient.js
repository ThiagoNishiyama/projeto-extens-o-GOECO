// Local client - substituto independente do @base44/sdk
// Persiste dados no localStorage, auth local, LLM via API Anthropic (opcional)

const DB_KEY = 'goeco_db';
const TOKEN_KEY = 'goeco_token';
const ACCOUNTS_KEY = 'goeco_accounts';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getDB() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getEntityList(name) {
  return getDB()[name] || [];
}

function saveEntityList(name, items) {
  const db = getDB();
  db[name] = items;
  saveDB(db);
}

function applySortAndLimit(items, sort, limit) {
  let result = [...items];
  if (sort) {
    const desc = sort.startsWith('-');
    const field = sort.replace(/^-/, '');
    result.sort((a, b) => {
      const va = a[field] ?? '';
      const vb = b[field] ?? '';
      if (va < vb) return desc ? 1 : -1;
      if (va > vb) return desc ? -1 : 1;
      return 0;
    });
  }
  if (limit) result = result.slice(0, limit);
  return result;
}

function createEntityClient(entityName) {
  return {
    list: async (sort, limit) => {
      const items = getEntityList(entityName);
      return applySortAndLimit(items, sort, limit);
    },

    filter: async (filters, sort, limit) => {
      let items = getEntityList(entityName);
      if (filters) {
        items = items.filter((item) =>
          Object.entries(filters).every(([k, v]) => item[k] === v)
        );
      }
      return applySortAndLimit(items, sort, limit);
    },

    create: async (data) => {
      const items = getEntityList(entityName);
      const item = {
        id: generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        ...data,
      };
      items.push(item);
      saveEntityList(entityName, items);
      return item;
    },

    update: async (id, data) => {
      const items = getEntityList(entityName);
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error(`${entityName} not found: ${id}`);
      items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() };
      saveEntityList(entityName, items);
      return items[idx];
    },

    delete: async (id) => {
      const items = getEntityList(entityName);
      const idx = items.findIndex((i) => i.id === id);
      if (idx !== -1) {
        items.splice(idx, 1);
        saveEntityList(entityName, items);
      }
    },
  };
}

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function syncUserToEntity(userRecord) {
  const items = getEntityList('User');
  const idx = items.findIndex((u) => u.email === userRecord.email);
  const entityUser = {
    id: userRecord.id,
    email: userRecord.email,
    full_name: userRecord.full_name,
    display_name: userRecord.display_name,
    bio: userRecord.bio,
    avatar_url: userRecord.avatar_url,
    banner_url: userRecord.banner_url,
    points: userRecord.points ?? 0,
    total_discards: userRecord.total_discards ?? 0,
    total_weight_kg: userRecord.total_weight_kg ?? 0,
    co2_saved_kg: userRecord.co2_saved_kg ?? 0,
    created_date: userRecord.created_date,
    updated_date: new Date().toISOString(),
  };
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...entityUser };
  } else {
    items.push(entityUser);
  }
  saveEntityList('User', items);
}

const auth = {
  isAuthenticated: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  me: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw Object.assign(new Error('Not authenticated'), { status: 401 });
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email === token);
    if (!account) throw Object.assign(new Error('User not found'), { status: 401 });
    // Return merged data: account + any updates stored in User entity
    const entityUsers = getEntityList('User');
    const entityUser = entityUsers.find((u) => u.email === token);
    return entityUser ? { ...account, ...entityUser } : account;
  },

  logout: (redirectUrl) => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  },

  redirectToLogin: (_url) => {
    window.location.href = '/login';
  },

  updateMe: async (update) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Not authenticated');
    const accounts = getAccounts();
    const idx = accounts.findIndex((a) => a.email === token);
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...update, updated_date: new Date().toISOString() };
      saveAccounts(accounts);
      syncUserToEntity(accounts[idx]);
      return accounts[idx];
    }
    throw new Error('User not found');
  },

  // Used by Login page
  login: async (email, password) => {
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email === email && a.password === password);
    if (!account) throw new Error('Email ou senha incorretos');
    localStorage.setItem(TOKEN_KEY, email);
    return account;
  },

  register: async (email, password, fullName) => {
    const accounts = getAccounts();
    if (accounts.find((a) => a.email === email)) {
      throw new Error('Este email já está cadastrado');
    }
    const newUser = {
      id: generateId(),
      email,
      password,
      full_name: fullName || email.split('@')[0],
      display_name: fullName || email.split('@')[0],
      bio: '',
      avatar_url: null,
      banner_url: null,
      points: 0,
      total_discards: 0,
      total_weight_kg: 0,
      co2_saved_kg: 0,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    accounts.push(newUser);
    saveAccounts(accounts);
    syncUserToEntity(newUser);
    localStorage.setItem(TOKEN_KEY, email);
    return newUser;
  },
};

async function invokeLLM({ prompt, response_json_schema }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Mock fallback when no API key is configured
    if (response_json_schema) {
      return {
        item_name: 'Item Eletrônico',
        category: 'Smartphone',
        risk_level: 'Médio',
        risk_description:
          'Contém materiais que podem ser prejudiciais ao meio ambiente se descartados incorretamente.',
        how_to_discard: [
          'Procure um ecoponto próximo usando o mapa da plataforma',
          'Entregue o item ao ponto de coleta credenciado',
          'Solicite o comprovante de descarte responsável',
        ],
        materials: ['Plástico', 'Metal', 'Vidro', 'Lítio'],
        eco_tip: 'Cada descarte correto faz diferença para o planeta! Juntos somos mais fortes.',
        can_reuse: false,
        reuse_suggestion: '',
      };
    }
    return 'Olá! Sou o assistente GO-ECO. Para respostas completas via IA, configure a variável VITE_ANTHROPIC_API_KEY no arquivo .env.local. Posso ajudá-lo com informações sobre reciclagem, ecopontos e o sistema de pontos da plataforma!';
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-client': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  if (response_json_schema) {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : {};
    } catch {
      return {};
    }
  }
  return text;
}

async function uploadFile({ file }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ file_url: e.target.result });
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

const ENTITY_NAMES = [
  'User',
  'Post',
  'Comment',
  'Challenge',
  'EcoPoint',
  'Follow',
  'Message',
  'Conversation',
  'Notification',
  'Product',
  'RewardItem',
];

export const base44 = {
  auth,
  entities: Object.fromEntries(ENTITY_NAMES.map((name) => [name, createEntityClient(name)])),
  integrations: {
    Core: {
      InvokeLLM: invokeLLM,
      UploadFile: uploadFile,
    },
  },
};
