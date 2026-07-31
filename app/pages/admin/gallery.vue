<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Gallery</h1>
        <p class="text-gray-400 text-sm mt-1">Upload and manage parish photos</p>
      </div>
      <label class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + Upload Photos
        <input type="file" accept="image/*" multiple class="hidden" @change="handleUpload" />
      </label>
    </div>

    <p v-if="uploading" class="text-gold text-sm font-semibold mb-4 bg-gold/10 rounded-xl px-4 py-3">Uploading {{ uploadProgress }}...</p>

    <div v-if="loading" class="text-center py-20 text-gray-400 text-sm">Loading gallery...</div>
    <div v-else-if="photos.length === 0" class="text-center py-20 text-gray-400 text-sm">No photos yet. Upload some!</div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="photo in photos" :key="photo.id" class="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm">
        <img :src="photo.image_url" :alt="photo.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <button @click="deletePhoto(photo)" class="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
        <div v-if="photo.title" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p class="text-white text-xs font-semibold truncate">{{ photo.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const loading = ref(true)
const uploading = ref(false)
const uploadProgress = ref('')
const photos = ref<any[]>([])

onMounted(loadPhotos)

async function loadPhotos() {
  loading.value = true
  const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
  photos.value = data ?? []
  loading.value = false
}

async function handleUpload(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  if (!files.length) return
  uploading.value = true
  for (let i = 0; i < files.length; i++) {
    uploadProgress.value = `${i + 1} of ${files.length}`
    const file = files[i]
    const ext = file.name.split('.').pop()
    const path = `gallery/${Date.now()}-${i}.${ext}`
    const { data, error } = await supabase.storage.from('parish-media').upload(path, file, { upsert: true })
    if (!error && data) {
      const { data: url } = supabase.storage.from('parish-media').getPublicUrl(path)
      await supabase.from('gallery').insert({ image_url: url.publicUrl, title: file.name.replace(/\.[^.]+$/, '') })
    }
  }
  uploading.value = false
  loadPhotos()
}

async function deletePhoto(photo: any) {
  if (!confirm('Delete this photo?')) return
  await supabase.from('gallery').delete().eq('id', photo.id)
  loadPhotos()
}
</script>
