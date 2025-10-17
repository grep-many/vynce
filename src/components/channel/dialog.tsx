import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const ChannelDialogue = ({ isopen, onclose, channeldata, mode }: any) => {
// TODO remove the static data
  const user: any = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://github.com/shadcn.png?height=32&width=32',
  };
  const router = useRouter()
  const [formData, setFormData] = React.useState<any>({
    name: "",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev:any)=>({...prev,[name]:value}))
  };

  const handlesubmit = async (e: FormEvent) => {
    e.preventDefault()
  };

  React.useEffect(() => {
    if (channeldata && mode == "edit") {
      setFormData({
        name: channeldata.name || "",
        description:channeldata.description||""
      })
    } else {
      setFormData({
        name: user.name || "",
        description:""
      })
    }
  },[channeldata])
  return (
    <Dialog open={isopen} onOpenChange={onclose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create your channel' : 'Edit your channel'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handlesubmit} className="space-y-6">
          {/* Channel Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {/* Channel Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Channel Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell viewers about your channel..."
            />
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={onclose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : mode === 'create'
                ? 'Create Channel'
                : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDialogue;
