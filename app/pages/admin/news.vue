<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">News</h1>
        <p class="text-gray-400 text-sm mt-1">Manage parish news posts</p>
      </div>
      <button @click="openForm()" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + New Post
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading...</div>
      <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-400 text-sm">No posts yet. Create your first one!</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id" class="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <img v-if="post.image_url" :src="post.image_url" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div v-else class="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0 text-lg">📰</div>
                <p class="font-semibold text-navy truncate max-w-xs">{{ post.title }}</p>
              </div>
            </td>
            <td class="px-5 py-4 text-gray-400 hidden md:table-cell">{{ new Date(post.created_at).toLocaleDateString() }}</td>
            <td class="px-5 py-4">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', post.published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500']">
                {{ post.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-3 justify-end">
                <button @click="togglePublish(post)" class="text-xs text-blue-400 hover:text-blue-600 font-bold transition-colors">
                  {{ post.published ? 'Unpublish' : 'Publish' }}
                </button>
                <button @click="openForm(post)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
                <button @click="deletePost(post.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editing ? 'Edit Post' : 'New Post' }}</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-navy transition-colors text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input v-model="form.title" type="text" placeholder="Post title"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
            <select v-model="form.category" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all">
              <option value="Announcement">Announcement</option>
              <option value="Notice">Notice</option>
              <option value="Event">Event</option>
              <option value="News">News</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Excerpt</label>
            <input v-model="form.excerpt" type="text" placeholder="Short description shown in list"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Content</label>
            <textarea v-model="form.content" rows="6" placeholder="Full post content..."
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cover Image</label>
            <input type="file" accept="image/*" @change="handleImageUpload"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-navy/5 file:text-navy hover:file:bg-navy/10 transition-all" />
            <img v-if="form.image_url" :src="form.image_url" class="mt-3 h-32 rounded-xl object-cover" />
            <p v-if="uploading" class="text-xs text-gold mt-2">Uploading image...</p>
          </div>
          <div class="flex items-center gap-3">
            <input v-model="form.published" type="checkbox" id="published" class="w-4 h-4 accent-gold" />
            <label for="published" class="text-sm font-semibold text-navy">Publish immediately</label>
          </div>
          <p v-if="formError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ formError }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button @click="savePost" :disabled="saving" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              {{ saving ? 'Saving...' : 'Save Post' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const loading = ref(true)
const posts = ref<any[]>([])
const showForm = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const uploading = ref(false)
const formError = ref('')

const form = reactive({ title: '', category: 'Announcement', excerpt: '', content: '', image_url: '', published: false })

onMounted(loadPosts)

async function loadPosts() {
  loading.value = true
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
  posts.value = data ?? []
  loading.value = false
}

function openForm(post?: any) {
  editing.value = post ?? null
  formError.value = ''
  if (post) {
    Object.assign(form, { title: post.title, category: post.category ?? 'Announcement', excerpt: post.excerpt ?? '', content: post.content ?? '', image_url: post.image_url ?? '', published: post.published })
  } else {
    Object.assign(form, { title: '', category: 'Announcement', excerpt: '', content: '', image_url: '', published: false })
  }
  showForm.value = true
}

async function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  const path = `news/${Date.now()}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage.from('parish-media').upload(path, file, { upsert: true })
  if (error) { formError.value = 'Image upload failed: ' + error.message; uploading.value = false; return }
  if (data) {
    const { data: url } = supabase.storage.from('parish-media').getPublicUrl(path)
    form.image_url = url.publicUrl
  }
  uploading.value = false
}

async function savePost() {
  if (!form.title) { formError.value = 'Title is required.'; return }
  saving.value = true
  formError.value = ''
  const payload: any = {
    title: form.title,
    excerpt: form.excerpt,
    content: form.content,
    image_url: form.image_url,
    published: form.published,
  }
  // only include category if the column exists (avoids schema cache errors)
  try { payload.category = form.category } catch {}
  let err
  if (editing.value) {
    const res = await supabase.from('news').update(payload).eq('id', editing.value.id)
    err = res.error
  } else {
    const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
    const res = await supabase.from('news').insert({ ...payload, slug })
    err = res.error
  }
  if (err?.message?.includes('category')) {
    // category column missing — retry without it
    delete payload.category
    if (editing.value) {
      const res = await supabase.from('news').update(payload).eq('id', editing.value.id)
      err = res.error
    } else {
      const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
      const res = await supabase.from('news').insert({ ...payload, slug })
      err = res.error
    }
  }
  saving.value = false
  if (err) { formError.value = err.message; return }
  showForm.value = false
  loadPosts()
}

async function togglePublish(post: any) {
  await supabase.from('news').update({ published: !post.published }).eq('id', post.id)
  loadPosts()
}

async function deletePost(id: string) {
  if (!confirm('Delete this post? This cannot be undone.')) return
  await supabase.from('news').delete().eq('id', id)
  loadPosts()
}
</script>
